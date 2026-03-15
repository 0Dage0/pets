package com.maomao.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private String conversationId;
    private String receiverId;
    private String petId;
    private String type = "text";
    private String content;
}
