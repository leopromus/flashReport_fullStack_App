import React, { createContext, useContext, useEffect, useState } from 'react';
import { websocketService } from '../../services/websocket';
import { StatusUpdateMessage } from '../../types/websocket';
import { notifications as mantineNotifications } from '@mantine/notifications';

interface NotificationContextType {
    notifications: StatusUpdateMessage[];
}

const NotificationContext = createContext<NotificationContextType>({ notifications: [] });

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<StatusUpdateMessage[]>([]);

    useEffect(() => {
        websocketService.connect();

        const unsubscribe = websocketService.subscribe((message) => {
            setNotifications(prev => [...prev, message]);

            mantineNotifications.show({
                title: 'Report Status Update',
                message: `Report "${message.reportTitle}" status changed to ${message.newStatus}`,
                color: 'blue',
                autoClose: 5000,
            });
        });

        return () => {
            unsubscribe();
            websocketService.disconnect();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
