package com.flashreport.api.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public boolean sendEmail(String to, String subject, String body) {
        if (fromEmail == null || fromEmail.isEmpty()) {
            log.warn("Email service is not configured. fromEmail is empty or null");
            return false;
        }

        log.debug("Attempting to send email to: {} with subject: {}", to, subject);
        log.debug("Using sender email: {}", fromEmail);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
            return true;
        } catch (MailException e) {
            log.error("Mail server error while sending email to: {}. Error: {}", to, e.getMessage());
            log.debug("Detailed mail error:", e);
            return false;
        } catch (Exception e) {
            log.error("Unexpected error while sending email to: {}. Error: {}", to, e.getMessage());
            log.debug("Detailed error:", e);
            return false;
        }
    }

    public boolean sendStatusUpdateEmail(String to, String reportTitle, String newStatus) {
        log.debug("Preparing status update email for report: {} with new status: {}", reportTitle, newStatus);
        
        String subject = "Report Status Update - " + reportTitle;
        String body = String.format(
            "Dear User,\n\n" +
            "The status of your report '%s' has been updated to: %s\n\n" +
            "Thank you for using FlashReport.\n\n" +
            "Best regards,\n" +
            "FlashReport Team",
            reportTitle,
            newStatus
        );
        
        return sendEmail(to, subject, body);
    }
} 