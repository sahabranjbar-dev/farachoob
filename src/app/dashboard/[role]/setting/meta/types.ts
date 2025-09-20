import { Dispatch, SetStateAction } from "react";
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { IUserForm } from "../components/SettingForm";
import { ISettingStates } from "../../../../../../stores/types/SettingStore";

export interface IEditProfile {
  register: UseFormRegister<IUserForm>;
  watch: UseFormWatch<IUserForm>;
  control: Control<any>;
}

export interface INotificationsEdit extends Partial<IEditProfile> {}

export interface IEditPrivacy extends Partial<IEditProfile> {}

export interface IEditAppearance extends Partial<IEditProfile> {
  setUserData: (
    userData:
      | ISettingStates["userData"]
      | ((prev: ISettingStates["userData"]) => ISettingStates["userData"])
  ) => void;
}

export interface ISettingSidebar {
  // declare type
  setActiveTab: Dispatch<SetStateAction<any>>;
  activeTab: string;
}
