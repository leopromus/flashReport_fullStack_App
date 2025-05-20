package com.flashreport.api.event;

import com.flashreport.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StatusUpdateEventListener {

    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleStatusUpdateEvent(StatusUpdateEvent event) {
        // Send email notification
        emailService.sendStatusUpdateEmail(event.getUserEmail(), event.getReportTitle(), event.getNewStatus());

        // Send WebSocket notification
        messagingTemplate.convertAndSend("/topic/status-updates", event);
    }
}
