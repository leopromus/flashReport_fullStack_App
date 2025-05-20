package com.flashreport.api.dto;

import com.flashreport.api.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private String username;
    private String token;
    private String role;

    public static AuthResponse fromUser(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .username(user.getUsername())
                .token(token)
                .role(user.getRole().name())
                .build();
    }
} 