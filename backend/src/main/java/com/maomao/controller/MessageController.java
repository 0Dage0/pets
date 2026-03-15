package com.maomao.controller;

import com.maomao.dto.ConversationRequest;
import com.maomao.dto.MessageRequest;
import com.maomao.entity.Conversation;
import com.maomao.entity.Message;
import com.maomao.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations(Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        List<Conversation> conversations = messageService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }

    @PostMapping("/conversations")
    public ResponseEntity<Conversation> createConversation(@RequestBody ConversationRequest request, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            Conversation conversation = messageService.getOrCreateConversation(request, userId);
            return ResponseEntity.ok(conversation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        List<Message> messages = messageService.getConversationMessages(id);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            Message message = messageService.sendMessage(request, userId);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/conversations/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        messageService.markMessagesRead(id, userId);
        return ResponseEntity.ok().build();
    }
}
