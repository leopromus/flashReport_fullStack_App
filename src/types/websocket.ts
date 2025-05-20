import { IFrame } from '@stomp/stompjs';

export interface StatusUpdateMessage {
    reportId: number;
    reportTitle: string;
    newStatus: string;
    userEmail: string;
}

export type WebSocketSubscriber = (message: StatusUpdateMessage) => void;
