package com.maomao.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nickname;
    private String phone;
    private String password;
    private String city;
}
