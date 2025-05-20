package com.flashreport.api.repository;

import com.flashreport.api.model.Report;
import com.flashreport.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByCreatedByOrderByCreatedOnDesc(User user);
    List<Report> findAllByOrderByCreatedOnDesc();
    List<Report> findByTypeOrderByCreatedOnDesc(Report.ReportType type);
    List<Report> findByStatusOrderByCreatedOnDesc(Report.ReportStatus status);
    List<Report> findByCreatedByAndTypeOrderByCreatedOnDesc(User user, Report.ReportType type);
    List<Report> findByCreatedByAndStatusOrderByCreatedOnDesc(User user, Report.ReportStatus status);
} 