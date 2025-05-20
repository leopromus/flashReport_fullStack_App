package com.flashreport.api.dto;

import com.flashreport.api.model.Report;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReportResponse {
    private Long id;
    private LocalDateTime createdOn;
    private Long createdBy;
    private String title;
    private Report.ReportType type;
    private String location;
    private Report.ReportStatus status;
    private List<String> images;
    private List<String> videos;
    private String comment;

    public static ReportResponse fromReport(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setCreatedOn(report.getCreatedOn());
        response.setCreatedBy(report.getCreatedBy().getId());
        response.setTitle(report.getTitle());
        response.setType(report.getType());
        response.setLocation(report.getLocation());
        response.setStatus(report.getStatus());
        response.setImages(report.getImages());
        response.setVideos(report.getVideos());
        response.setComment(report.getComment());
        return response;
    }
} 