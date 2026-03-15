package com.maomao.dto;

import lombok.Data;
import java.util.List;

@Data
public class PetRequest {
    private String name;
    private String type;
    private String breed;
    private String age;
    private Integer ageMonths;
    private String gender;
    private String city;
    private List<String> healthTags;
    private List<String> traitTags;
    private String description;
    private List<String> requirements;
    private List<String> media;
}
