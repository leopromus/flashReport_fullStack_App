package com.flashreport.api.service;

import com.flashreport.api.dto.CreateReportRequest;
import com.flashreport.api.event.StatusUpdateEvent;
import com.flashreport.api.dto.ReportResponse;
import com.flashreport.api.dto.UpdateReportRequest;
import com.flashreport.api.exception.ResourceNotFoundException;
import com.flashreport.api.model.Report;
import com.flashreport.api.model.User;
import com.flashreport.api.repository.ReportRepository;
import com.flashreport.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ReportResponse createReport(CreateReportRequest request, List<MultipartFile> images, List<MultipartFile> videos) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Report report = new Report();
        report.setTitle(request.getTitle());
        report.setType(request.getType());
        report.setLocation(request.getLocation());
        report.setComment(request.getComment());
        report.setCreatedBy(user);
        report.setStatus(Report.ReportStatus.DRAFT);

        List<String> imageUrls = new ArrayList<>();
        if (images != null) {
            imageUrls = images.stream()
                    .map(fileStorageService::storeFile)
                    .collect(Collectors.toList());
        }
        report.setImages(imageUrls);

        List<String> videoUrls = new ArrayList<>();
        if (videos != null) {
            videoUrls = videos.stream()
                    .map(fileStorageService::storeFile)
                    .collect(Collectors.toList());
        }
        report.setVideos(videoUrls);

        Report savedReport = reportRepository.save(report);
        return ReportResponse.fromReport(savedReport);
    }

    public List<ReportResponse> getAllReports() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Report> reports;
        if (user.getRole() == User.Role.ADMIN) {
            reports = reportRepository.findAllByOrderByCreatedOnDesc();
        } else {
            reports = reportRepository.findByCreatedByOrderByCreatedOnDesc(user);
        }

        return reports.stream()
                .map(ReportResponse::fromReport)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> getReportsByType(Report.ReportType type) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Report> reports;
        if (user.getRole() == User.Role.ADMIN) {
            reports = reportRepository.findByTypeOrderByCreatedOnDesc(type);
        } else {
            reports = reportRepository.findByCreatedByAndTypeOrderByCreatedOnDesc(user, type);
        }

        return reports.stream()
                .map(ReportResponse::fromReport)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> getReportsByStatus(Report.ReportStatus status) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Report> reports;
        if (user.getRole() == User.Role.ADMIN) {
            reports = reportRepository.findByStatusOrderByCreatedOnDesc(status);
        } else {
            reports = reportRepository.findByCreatedByAndStatusOrderByCreatedOnDesc(user, status);
        }

        return reports.stream()
                .map(ReportResponse::fromReport)
                .collect(Collectors.toList());
    }

    public ReportResponse getReport(Long id) {
        Report report = findReportAndCheckAccess(id);
        return ReportResponse.fromReport(report);
    }

    @Transactional
    public ReportResponse updateReport(Long id, UpdateReportRequest request) {
        Report report = findReportAndCheckAccess(id);

        if (request.getTitle() != null) {
            report.setTitle(request.getTitle());
        }
        if (request.getType() != null) {
            report.setType(request.getType());
        }
        if (request.getLocation() != null) {
            report.setLocation(request.getLocation());
        }
        if (request.getComment() != null) {
            report.setComment(request.getComment());
        }
        if (request.getStatus() != null) {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (user.getRole() != User.Role.ADMIN) {
                throw new AccessDeniedException("Only admins can update report status");
            }
            Report.ReportStatus oldStatus = report.getStatus();
            report.setStatus(request.getStatus());
            
            // Publish status update event
            eventPublisher.publishEvent(new StatusUpdateEvent(
                this,
                report.getId(),
                report.getTitle(),
                request.getStatus().toString(),
                report.getCreatedBy().getEmail()
            ));
        }

        Report updatedReport = reportRepository.save(report);
        return ReportResponse.fromReport(updatedReport);
    }

    @Transactional
    public void deleteReport(Long id) {
        Report report = findReportAndCheckAccess(id);

        // Delete associated files
        report.getImages().forEach(fileStorageService::deleteFile);
        report.getVideos().forEach(fileStorageService::deleteFile);

        reportRepository.delete(report);
    }

    private Report findReportAndCheckAccess(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != User.Role.ADMIN && !report.getCreatedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to access this report");
        }

        return report;
    }
} 