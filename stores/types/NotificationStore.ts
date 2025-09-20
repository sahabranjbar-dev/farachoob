export interface INotificationStates {
  notificationCount: number;
  loading: boolean;
  // ACTIONS
  addNewNotification: () => void;
  setNotificationCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
}
