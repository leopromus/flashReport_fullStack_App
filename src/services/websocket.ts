import SockJS from 'sockjs-client';
import { Client, IFrame } from '@stomp/stompjs';
import { StatusUpdateMessage, WebSocketSubscriber } from '../types/websocket';

// Polyfill for global to fix 'global is not defined' error in browser
if (typeof window !== 'undefined' && typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

class WebSocketService {
    private client: Client | null = null;
    private subscribers: WebSocketSubscriber[] = [];

    connect(): void {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                console.log('Connected to WebSocket');
                this.subscribeToStatusUpdates();
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
            onStompError: (frame: IFrame) => {
                console.error('STOMP error', frame);
            }
        });

        this.client.activate();
    }

    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
    }

    private subscribeToStatusUpdates(): void {
        if (!this.client) return;

        this.client.subscribe('/topic/status-updates', (message) => {
            const statusUpdate: StatusUpdateMessage = JSON.parse(message.body);
            this.notifySubscribers(statusUpdate);
        });
    }

    subscribe(callback: WebSocketSubscriber): () => void {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notifySubscribers(message: StatusUpdateMessage): void {
        this.subscribers.forEach(callback => callback(message));
    }
}

export const websocketService = new WebSocketService();
