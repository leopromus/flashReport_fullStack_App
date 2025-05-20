package com.flashreport.api.dto;

import com.flashreport.api.model.Report;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReportRequest {
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    private Report.ReportType type;
    
    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;
    
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;
    
    private Report.ReportStatus status;
} 