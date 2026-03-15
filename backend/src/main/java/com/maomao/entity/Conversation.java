package com.maomao.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "conversation")
public class Conversation {

    @Id
    @Column(length = 36)
    private String id;

    @Column(columnDefinition = "JSON")
    private String participants;

    @Column(name = "pet_id", length = 36)
    private String petId;

    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastMessageAt == null) {
            lastMessageAt = LocalDateTime.now();
        }
    }
}
