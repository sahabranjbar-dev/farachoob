import { useSetting } from "../../../../../../stores/settingStore";

export function setProfileData(sessionData: any) {
  useSetting.getState().setUserData({
    email: sessionData.email ?? "",
    firstName: sessionData.firstName ?? "",
    phone: sessionData?.mobile ?? "",
    image: sessionData.image ?? "",
    lastName: sessionData.lastName ?? "",
    isActive: sessionData?.isActive ?? false,
    isVerified: sessionData?.isVerified ?? false,
    location: "",
    biography: "",
    notification: {
      email: false,
      pushNotification: false,
      sms: false,
    },
  });
}
