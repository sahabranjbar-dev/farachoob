export type Role = "ADMIN" | "MANAGER" | "AGENT" | "CUSTOMER";

interface User {
  id: number;
  name: string | null;
  email: string;
  roles: Role[];
  createdAt: string;
}
