package com.maomao.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdoptionRequest {
    private String petId;
    private String realName;
    private String phone;
    private Integer age;
    private String profession;
    private String livingType;
    private List<String> familyInfo;
    private String dailyHours;
    private String petExperience;
    private String motivation;
    private List<String> commitments;
}
