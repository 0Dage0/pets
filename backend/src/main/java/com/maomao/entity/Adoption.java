package com.maomao.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "adoption")
public class Adoption {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "pet_id", length = 36)
    private String petId;

    @Column(name = "applicant_id", length = 36)
    private String applicantId;

    @Column(length = 20)
    private String status = "pending";

    @Column(name = "real_name", length = 50)
    private String realName;

    @Column(length = 20)
    private String phone;

    private Integer age;

    @Column(length = 50)
    private String profession;

    @Column(name = "living_type", length = 50)
    private String livingType;

    @Column(name = "family_info", columnDefinition = "JSON")
    private String familyInfo;

    @Column(name = "daily_hours", length = 20)
    private String dailyHours;

    @Column(name = "pet_experience", length = 50)
    private String petExperience;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    @Column(columnDefinition = "JSON")
    private String commitments;

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
