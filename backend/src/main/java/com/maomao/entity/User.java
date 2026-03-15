package com.maomao.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 50)
    private String nickname;

    @Column(length = 255)
    private String avatar;

    @Column(length = 20, unique = true)
    private String phone;

    @Column(length = 255)
    private String password;

    @Column(length = 50)
    private String city;

    @Column(length = 20)
    private String role = "normal";

    @Column(name = "pet_count")
    private Integer petCount = 0;

    @Column(name = "adopt_count")
    private Integer adoptCount = 0;

    @Column(precision = 2, scale = 1)
    private Double rating = 5.0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
