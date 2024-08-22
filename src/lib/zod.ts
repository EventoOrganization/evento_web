// src\lib\zod.ts
import { z } from 'zod';

// SignIn schema for validating email and password fields during sign-in
export const signInSchema = z.object({
  email: z
    .string({ required_error: 'emailRequired' })
    .min(1, { message: 'emailRequired' })
    .email({ message: 'invalidEmail' }),
  password: z
    .string({ required_error: 'passwordRequired' })
    .min(1, { message: 'passwordRequired' })
    .min(8, { message: 'passwordMin' })
    .max(32, { message: 'passwordMax' }),
});

// SignUp schema for validating email, password, and confirm password fields during sign-up
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'emailRequired' })
      .email({ message: 'invalidEmail' }),
    password: z
      .string()
      .min(8, { message: 'passwordMin' })
      .max(32, { message: 'passwordMax' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'passwordMin' })
      .max(32, { message: 'passwordMax' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsdonotmatch',
    path: ['confirmPassword'],
  });

// Schema for validating the name field
export const nameSchema = z.object({
  name: z
    .string({ required_error: 'nameRequired' })
    .min(1, { message: 'nameRequired' }),
});

// Schema for validating the email field
export const emailSchema = z.object({
  email: z
    .string({ required_error: 'emailRequired' })
    .min(1, { message: 'emailRequired' })
    .email({ message: 'invalidEmail' }),
});

// Schema for validating the password field
export const passwordSchema = z.object({
  password: z
    .string({ required_error: 'passwordRequired' })
    .min(1, { message: 'passwordRequired' })
    .min(8, { message: 'passwordMin' })
    .max(32, { message: 'passwordMax' }),
});

// Schema for validating the reset code field
export const resetCodeSchema = z.object({
  resetCode: z.string().min(6, { message: 'codeRequired' }),
});

// Schema for validating the new password and confirm password fields
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'passwordMin' })
      .max(32, { message: 'passwordMax' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'passwordMin' })
      .max(32, { message: 'passwordMax' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsdonotmatch',
    path: ['confirmPassword'],
  });
