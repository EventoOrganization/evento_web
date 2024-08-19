// src/types/next-auth.d.ts
import { User as DefaultUser } from "@auth/core/types";

declare module "@auth/core/types" {
  interface User extends DefaultUser {
    data?: any;
  }
}
