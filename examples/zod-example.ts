// examples/zod-example.ts
import { z, ZodError } from "zod";

// Define a schema
const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  age: z.number().int().nonnegative(),
});

// Example data
const userData = {
  username: "John Doe",
  email: "john.doe@example.com",
  age: 30,
};

try {
  // Validate data
  userSchema.parse(userData);
} catch (e) {
  if (e instanceof ZodError) {
    console.error("Validation failed:", e.errors);
  } else {
    console.error("Unexpected error:", e);
  }
}
