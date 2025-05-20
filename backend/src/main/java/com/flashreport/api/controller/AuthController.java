package com.flashreport.api.controller;

import com.flashreport.api.dto.ApiResponse;
import com.flashreport.api.dto.AuthResponse;
import com.flashreport.api.dto.LoginRequest;
import com.flashreport.api.dto.RegisterRequest;
import com.flashreport.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(201, "User created successfully", response));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "User is successfully logged in", response));
    }
} 