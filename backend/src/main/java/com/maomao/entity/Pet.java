package com.maomao.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pet")
public class Pet {

    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 50)
    private String name;

    @Column(length = 20)
    private String type;

    @Column(length = 50)
    private String breed;

    @Column(length = 20)
    private String age;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Column(length = 20)
    private String gender;

    @Column(length = 50)
    private String city;

    @Column(length = 20)
    private String status = "available";

    @Column(name = "health_tags", columnDefinition = "JSON")
    private String healthTags;

    @Column(name = "trait_tags", columnDefinition = "JSON")
    private String traitTags;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    private String requirements;

    @Column(columnDefinition = "JSON")
    private String media;

    @Column(name = "owner_id", length = 36)
    private String ownerId;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "fav_count")
    private Integer favCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (viewCount == null) viewCount = 0;
        if (favCount == null) favCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
