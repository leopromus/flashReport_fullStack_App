package com.flashreport.api.dto;

import com.flashreport.api.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private String username;
    private String role;

    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().name());
        return response;
    }
} 