package com.flashreport.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private LocalDateTime createdOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @ElementCollection
    @CollectionTable(name = "report_images", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "report_videos", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "video_url")
    private List<String> videos = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    public enum ReportType {
        RED_FLAG,
        INTERVENTION
    }

    public enum ReportStatus {
        DRAFT,
        UNDER_INVESTIGATION,
        RESOLVED,
        REJECTED
    }
} 