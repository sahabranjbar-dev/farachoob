// lib/sms.ts
export async function sendSms(to: string, message: string) {
  // اینجا باید به پنل SMS خودت متصل شوی. به‌طور فرضی:
  console.log(`ارسال به ${to}: ${message}`);
  return true;
}
