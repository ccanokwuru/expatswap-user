// user details will include First name, Last name, phone number, email, password, and date of birth
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", {
    length: 100,
  }).unique(),
  email: varchar("email", {
    length: 255,
  })
    .unique()
    .notNull(),
  phone: varchar("phone", {
    length: 15,
  }).unique(),
  address: varchar("address", {
    length: 255,
  }),
  firstName: varchar("first_name", {
    length: 255,
  }),
  lastName: varchar("last_name", {
    length: 255,
  }),
  password: text("password").notNull(),
  dob: timestamp("dob"),
  createdAt: timestamp("created_at").defaultNow(),
});
