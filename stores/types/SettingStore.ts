import { Theme } from "@/app/dashboard/[role]/setting/components/SettingForm";

export interface ISettingStates {
  userData: IUserData;
  setUserData: (
    userData: IUserData | ((previousUserData: IUserData) => IUserData)
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface IUserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date | string;
  email?: string;
  biography?: string;
  phone?: string;
  location?: string;
  isActive?: boolean;
  isVerified?: boolean;
  image?: string;
  notification?: INotification;
  privacy?: IPrivacy;
  theme?: Theme;
}

interface INotification {
  email?: boolean;
  pushNotification?: boolean;
  sms?: boolean;
}

interface IPrivacy {
  profileVisible?: boolean;
  searchVisible?: boolean;
}
