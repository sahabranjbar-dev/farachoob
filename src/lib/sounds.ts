"use client";

export const getSendMessageSound = () => {
  if (typeof window !== "undefined") {
    return new Audio("/sounds/iphone-sending.mp3");
  }
  return null;
};

export const getReceiveMessageSound = () => {
  if (typeof window !== "undefined") {
    return new Audio("/sounds/Telegram_Notification.mp3");
  }
  return null;
};

export const getNotificationSound = () => {
  if (typeof window !== "undefined") {
    return new Audio("/sounds/new-notification.mp3");
  }
  return null;
};
