package com.maomao.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maomao.dto.ConversationRequest;
import com.maomao.dto.MessageRequest;
import com.maomao.entity.Conversation;
import com.maomao.entity.Message;
import com.maomao.entity.Notification;
import com.maomao.entity.User;
import com.maomao.repository.ConversationRepository;
import com.maomao.repository.MessageRepository;
import com.maomao.repository.NotificationRepository;
import com.maomao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipantsContaining(userId);
    }

    public Conversation getOrCreateConversation(ConversationRequest request, String userId) {
        String participantId = request.getParticipantId();
        String petId = request.getPetId();

        // Find existing conversation
        List<Conversation> conversations = conversationRepository.findByParticipantsContaining(userId);
        Optional<Conversation> existing = conversations.stream()
            .filter(c -> {
                try {
                    List<String> participants = objectMapper.readValue(c.getParticipants(), new TypeReference<List<String>>() {});
                    return participants.contains(participantId) &&
                           ((petId != null && petId.equals(c.getPetId())) || (petId == null && c.getPetId() == null));
                } catch (JsonProcessingException e) {
                    return false;
                }
            })
            .findFirst();

        if (existing.isPresent()) {
            return existing.get();
        }

        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID().toString());
        try {
            conversation.setParticipants(objectMapper.writeValueAsString(List.of(userId, participantId)));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("数据序列化失败");
        }
        conversation.setPetId(petId);
        conversation.setLastMessageAt(LocalDateTime.now());

        return conversationRepository.save(conversation);
    }

    public List<Message> getConversationMessages(String conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Transactional
    public Message sendMessage(MessageRequest request, String senderId) {
        String conversationId = request.getConversationId();

        Conversation conversation;
        if (conversationId == null || conversationId.isEmpty()) {
            // Create new conversation
            conversation = new Conversation();
            conversation.setId(UUID.randomUUID().toString());
            try {
                conversation.setParticipants(objectMapper.writeValueAsString(List.of(senderId, request.getReceiverId())));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("数据序列化失败");
            }
            conversation.setPetId(request.getPetId());
            conversation.setLastMessageAt(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
            conversationId = conversation.getId();
        } else {
            conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("会话不存在"));
        }

        Message message = new Message();
        message.setId(UUID.randomUUID().toString());
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setType(request.getType() != null ? request.getType() : "text");
        message.setContent(request.getContent());

        message = messageRepository.save(message);

        // Update conversation
        conversation.setLastMessage(message.getContent());
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        // Send notification to receiver
        try {
            List<String> participants = objectMapper.readValue(conversation.getParticipants(), new TypeReference<List<String>>() {});
            String receiverId = participants.stream()
                .filter(p -> !p.equals(senderId))
                .findFirst()
                .orElse(null);

            if (receiverId != null) {
                User receiver = userRepository.findById(receiverId).orElse(null);
                if (receiver != null) {
                    Notification notification = new Notification();
                    notification.setId(UUID.randomUUID().toString());
                    notification.setUserId(receiverId);
                    notification.setType("message");
                    notification.setTitle("新消息");
                    notification.setContent("您收到了新的消息");
                    notificationRepository.save(notification);
                }
            }
        } catch (JsonProcessingException e) {
            // Ignore notification error
        }

        return message;
    }

    @Transactional
    public void markMessagesRead(String conversationId, String userId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        for (Message message : messages) {
            if (!message.getSenderId().equals(userId) && message.getReadAt() == null) {
                message.setReadAt(LocalDateTime.now());
                messageRepository.save(message);
            }
        }
    }
}
