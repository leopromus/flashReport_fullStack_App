package com.flashreport.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flashreport.api.model.Report;
import com.flashreport.api.model.User;
import com.flashreport.api.repository.ReportRepository;
import com.flashreport.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SampleDataLoader {
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void loadSampleData() {
        try {
            // Load JSON data
            ClassPathResource resource = new ClassPathResource("sample-data.json");
            Map<String, Object> data = objectMapper.readValue(
                resource.getInputStream(),
                new TypeReference<Map<String, Object>>() {}
            );

            // Load users
            for (Map<String, Object> userData : (Iterable<Map<String, Object>>) data.get("users")) {
                if (!userRepository.existsByUsername((String) userData.get("username"))) {
                    User user = new User();
                    user.setEmail((String) userData.get("email"));
                    user.setFirstname((String) userData.get("firstname"));
                    user.setLastname((String) userData.get("lastname"));
                    user.setPassword((String) userData.get("password"));
                    user.setPhoneNumber((String) userData.get("phoneNumber"));
                    user.setRole(User.Role.valueOf((String) userData.get("role")));
                    user.setUsername((String) userData.get("username"));
                    userRepository.save(user);
                    log.info("Created user: {}", user.getUsername());
                }
            }

            // Load reports
            for (Map<String, Object> reportData : (Iterable<Map<String, Object>>) data.get("reports")) {
                String username = (String) reportData.get("username");
                User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

                Report report = new Report();
                report.setTitle((String) reportData.get("title"));
                report.setType(Report.ReportType.valueOf((String) reportData.get("type")));
                report.setLocation((String) reportData.get("location"));
                report.setStatus(Report.ReportStatus.valueOf((String) reportData.get("status")));
                report.setComment((String) reportData.get("comment"));
                report.setCreatedOn(LocalDateTime.parse((String) reportData.get("createdOn")));
                report.setCreatedBy(user);
                report.setImages((java.util.List<String>) reportData.get("images"));
                report.setVideos((java.util.List<String>) reportData.get("videos"));
                
                reportRepository.save(report);
                log.info("Created report: {}", report.getTitle());
            }

            log.info("Sample data loaded successfully");
        } catch (Exception e) {
            log.error("Error loading sample data", e);
        }
    }
} 