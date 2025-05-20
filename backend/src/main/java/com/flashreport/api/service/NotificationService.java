package com.flashreport.api.service;

import com.flashreport.api.model.User;
import com.flashreport.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public boolean notifyUser(Long userId, String message) {
        try {
            log.debug("Attempting to notify user with ID: {}", userId);
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            
            log.debug("Found user: {} with email: {}", user.getUsername(), user.getEmail());

            // Send email notification
            String subject = "FlashReport Status Update";
            boolean emailSent = emailService.sendEmail(user.getEmail(), subject, message);

            if (!emailSent) {
                log.warn("Could not send email notification to user: {} ({})", user.getUsername(), user.getEmail());
                return false;
            }

            log.info("Successfully sent notification to user: {} ({})", user.getUsername(), user.getEmail());
            return true;
        } catch (Exception e) {
            log.error("Failed to send notification. Error: {}", e.getMessage(), e);
            return false;
        }
    }
} 