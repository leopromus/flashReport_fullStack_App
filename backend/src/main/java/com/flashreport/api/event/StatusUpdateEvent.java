package com.flashreport.api.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class StatusUpdateEvent extends ApplicationEvent {
    private final Long reportId;
    private final String reportTitle;
    private final String newStatus;
    private final String userEmail;

    public StatusUpdateEvent(Object source, Long reportId, String reportTitle, String newStatus, String userEmail) {
        super(source);
        this.reportId = reportId;
        this.reportTitle = reportTitle;
        this.newStatus = newStatus;
        this.userEmail = userEmail;
    }
}
