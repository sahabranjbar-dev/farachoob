// تعریف نقش‌ها به صورت رشته‌ای (string)
export type Role = {
  id?: string;
  farsiTitle?: string;
  englishTitle?: string;
};

interface User {
  id: number;
  name: string | null;
  email: string;
  roles: string[];
  createdAt: string;
  permissions: string[];
}
