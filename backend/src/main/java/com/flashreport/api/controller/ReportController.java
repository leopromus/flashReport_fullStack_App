package com.flashreport.api.controller;

import com.flashreport.api.dto.ApiResponse;
import com.flashreport.api.dto.CreateReportRequest;
import com.flashreport.api.dto.ReportResponse;
import com.flashreport.api.dto.UpdateReportRequest;
import com.flashreport.api.model.Report;
import com.flashreport.api.service.ReportService;
import com.flashreport.api.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/red-flags")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports(
            @RequestParam(required = false) Report.ReportType type,
            @RequestParam(required = false) Report.ReportStatus status) {
        List<ReportResponse> reports;
        if (type != null) {
            reports = reportService.getReportsByType(type);
        } else if (status != null) {
            reports = reportService.getReportsByStatus(status);
        } else {
            reports = reportService.getAllReports();
        }
        return ResponseEntity.ok(new ApiResponse<>(200, "Reports retrieved successfully", reports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReport(@PathVariable Long id) {
        ReportResponse report = reportService.getReport(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Report retrieved successfully", report));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            @Valid @RequestPart("report") CreateReportRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos) {
        ReportResponse report = reportService.createReport(request, images, videos);
        return ResponseEntity.ok(new ApiResponse<>(201, "Created red-flag record", report));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReport(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportRequest request) {
        // Regular update for non-status fields
        if (request.getStatus() == null) {
            ReportResponse report = reportService.updateReport(id, request);
            return ResponseEntity.ok(new ApiResponse<>(200, "Updated red-flag record", report));
        } else {
            // If status is being updated, ensure only admins can do it
            throw new IllegalArgumentException("Status updates must be done through the admin endpoint");
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReportResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportRequest request) {
        if (request.getStatus() == null) {
            throw new IllegalArgumentException("Status field is required for status updates");
        }

        // Update the status
        ReportResponse report = reportService.updateReport(id, request);

        // Send notification to the report owner
        String message = String.format("Your report '%s' status has been updated to %s", 
            report.getTitle(), report.getStatus());
        notificationService.notifyUser(report.getCreatedBy(), message);

        return ResponseEntity.ok(new ApiResponse<>(200, 
            "Updated report status and notified user", report));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @reportService.isOwner(#id, authentication.name)")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Red-flag record has been deleted", null));
    }
} 