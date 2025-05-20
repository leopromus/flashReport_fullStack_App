package com.flashreport.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flashreport.api.dto.CreateReportRequest;
import com.flashreport.api.model.Report;
import com.flashreport.api.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class TestDataLoader implements CommandLineRunner {

    private final ReportService reportService;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        loadTestData();
    }

    private void loadTestData() throws IOException {
        ClassPathResource resource = new ClassPathResource("test-data.json");
        Map<String, List<Map<String, Object>>> data = objectMapper.readValue(resource.getInputStream(), Map.class);
        
        List<Map<String, Object>> reports = data.get("reports");
        for (Map<String, Object> reportData : reports) {
            CreateReportRequest request = new CreateReportRequest();
            request.setTitle((String) reportData.get("title"));
            request.setType(Report.ReportType.valueOf((String) reportData.get("type")));
            request.setLocation((String) reportData.get("location"));
            request.setComment((String) reportData.get("comment"));
            
            try {
                reportService.createReport(request, null, null);
                System.out.println("Created test report: " + request.getTitle());
            } catch (Exception e) {
                System.err.println("Failed to create test report: " + request.getTitle());
                e.printStackTrace();
            }
        }
    }
} 