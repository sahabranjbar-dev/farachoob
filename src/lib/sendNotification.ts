import { NotificationType } from "@/types/common";

export async function sendNotification(message: string, userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/send-notification`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        userId,
      }),
    }
  );

  const result = await response.json();

  return response;
}

export async function createNnotification(
  message: string,
  userId: string,
  title: string,
  type?: NotificationType
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/notifications`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        userId,
        title,
        type,
      }),
    }
  );

  const result = await response.json();

  return response;
}
