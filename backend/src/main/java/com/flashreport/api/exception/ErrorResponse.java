package com.flashreport.api.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String message;
    private String errorCode;
    private String path;
    private LocalDateTime timestamp;

    public ErrorResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, String errorCode, String path) {
        this.message = message;
        this.errorCode = errorCode;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
} 