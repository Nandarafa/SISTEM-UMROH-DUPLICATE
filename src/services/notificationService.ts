export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  return [
    {
      id: "1",
      title: "Sistem",
      message: "Selamat datang di sistem manajemen.",
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  return true;
}
