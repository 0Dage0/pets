package com.maomao.service;

import com.maomao.entity.Notification;
import com.maomao.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("通知不存在"));

        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadAtIsNull(userId);
    }
}
