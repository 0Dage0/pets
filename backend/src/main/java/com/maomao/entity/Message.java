package com.maomao.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "message")
public class Message {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "conversation_id", length = 36)
    private String conversationId;

    @Column(name = "sender_id", length = 36)
    private String senderId;

    @Column(length = 20)
    private String type = "text";

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
