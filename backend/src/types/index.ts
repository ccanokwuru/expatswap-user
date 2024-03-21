import { user } from "@/utils/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z, TypeOf } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(user, {
  username: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  address: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long"
    ),
  dob: z.date(),
});

export type User = TypeOf<typeof insertUserSchema>;
// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(user);

export type UserFilters = { column: keyof User; direction: "asc" | "desc" };
