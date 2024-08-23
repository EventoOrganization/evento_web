// src\lib\zod.ts
import { z } from "zod";

// SignIn schema for validating email and password fields during sign-in
export const signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

// SignUp schema for validating email, password, and confirm password fields during sign-up
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "emailRequired" })
      .email({ message: "invalidEmail" }),
    password: z
      .string()
      .min(8, { message: "passwordMin" })
      .max(32, { message: "passwordMax" }),
    confirmPassword: z
      .string()
      .min(8, { message: "passwordMin" })
      .max(32, { message: "passwordMax" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsdonotmatch",
    path: ["confirmPassword"],
  });

// Schema for validating the name field
export const nameSchema = z.object({
  name: z
    .string({ required_error: "nameRequired" })
    .min(1, { message: "nameRequired" }),
});

// Schema for validating the email field
export const emailSchema = z.object({
  email: z
    .string({ required_error: "emailRequired" })
    .min(1, { message: "emailRequired" })
    .email({ message: "invalidEmail" }),
});

// Schema for validating the password field
export const passwordSchema = z.object({
  password: z
    .string({ required_error: "passwordRequired" })
    .min(1, { message: "passwordRequired" })
    .min(8, { message: "passwordMin" })
    .max(32, { message: "passwordMax" }),
});

// Schema for validating the reset code field
export const resetCodeSchema = z.object({
  resetCode: z.string().min(6, { message: "codeRequired" }),
});

// Schema for validating the new password and confirm password fields
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "passwordMin" })
      .max(32, { message: "passwordMax" }),
    confirmPassword: z
      .string()
      .min(8, { message: "passwordMin" })
      .max(32, { message: "passwordMax" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsdonotmatch",
    path: ["confirmPassword"],
  });

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventType: z.enum(["public", "private"]),
  name: z.string().min(1, "Name is required"),
  mode: z.enum(["virtual", "in-person"]),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  description: z.string().min(1, "Description is required"),
  includeChat: z.boolean().default(false),
  createRSVP: z.boolean().default(false),
  latitude: z.string().min(1, "Latitude is required").optional(),
  longitude: z.string().min(1, "Longitude is required").optional(),
  location: z.string().min(1, "Location is required").optional(),
  coHosts: z.array(z.string()).optional(),
  guests: z.array(z.string()).optional(),
  interestId: z.array(z.string()).min(1, "Interest is required").optional(),
  privateEventLink: z.string().url().optional(),
  images: z.any().optional(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        required: z.boolean(),
        options: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  additionalField: z.any().optional(),
  video: z.string().optional(),
});
