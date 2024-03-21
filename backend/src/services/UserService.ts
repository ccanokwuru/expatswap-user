import { scryptSync, randomBytes } from "node:crypto";
import { countDistinct, eq, between } from "drizzle-orm";
import { database } from "@/utils/database";
import { PAGINATION } from "@/utils/database/constants";
import { user } from "@/utils/database/schema";
import { User, insertUserSchema } from "@/types";

export const hashPassword = (password: string) => {
  const salt = randomBytes(21).toString("hex");
  const hash = scryptSync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
};

export const verifyPassword = ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}) => {
  const [salt, val] = hash.split(":");
  return scryptSync(password, salt, 64).toString("hex") == val;
};

export const validateCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await getOneUserEmail(email);

  const match = user?.password
    ? verifyPassword({ password, hash: user.password })
    : undefined;
  if (!match) {
    return null;
  }

  return user;
};

export const newUser = async (data: User) => {
  try {
    return await database
      .insert(user)
      .values(data)
      .prepare("new user")
      .execute();
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error, null, 2));
  }
};

export const deleteUsers = async (id: number) => {
  try {
    return await database
      .delete(user)
      .where(eq(user.id, id))
      .prepare("delete user")
      .execute();
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error, null, 2));
  }
};

export const getAllUsers = async (
  page = 1,
  date?: { start: Date; end: Date },
  order?: { column: keyof User; direction: "asc" | "desc" }
) => {
  try {
    return await database.transaction(async (tx) => {
      const users = !date
        ? await tx.query.user
            .findMany({
              offset: (page - 1) * PAGINATION,
              limit: page * PAGINATION,
              orderBy: (user, { asc, desc }) => [
                order?.direction !== "desc"
                  ? asc(user[order?.column ?? "createdAt"])
                  : desc(user[order?.column ?? "createdAt"]),
              ],
            })
            .prepare("get all users")
            .execute()
        : await tx.query.user
            .findMany({
              offset: (page - 1) * PAGINATION,
              limit: page * PAGINATION,
              orderBy: (user, { asc, desc }) => [
                order?.direction !== "desc"
                  ? asc(user[order?.column ?? "createdAt"])
                  : desc(user[order?.column ?? "createdAt"]),
              ],
              where: (user, { between }) =>
                between(user.createdAt, date.start, date.end),
            })
            .prepare("get all users")
            .execute();

      const amount = !date
        ? await tx
            .select({ total: countDistinct(user.id) })
            .from(user)
            .prepare("get total users count")
            .execute()
        : await tx
            .select({ total: countDistinct(user.id) })
            .from(user)
            .where(between(user.createdAt, date.start, date.end))
            .prepare("get total users count")
            .execute();
      const total = amount.map((e) => e.total).reduce((a, b) => a + b);

      return {
        total,
        users,
        page,
        total_pages: Math.ceil(total / PAGINATION),
      };
    });
    // return await database.query.user.findMany().prepare().execute();
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error, null, 2));
  }
};

export const getOneUser = async (id: number) => {
  try {
    return await database.query.user
      .findFirst({
        where: (user, { eq }) => eq(user.id, id),
      })
      .prepare("get one user")
      .execute();
  } catch (error) {
    console.log(error);
    throw new Error("User was not found");
  }
};

export const getOneUserEmail = async (email: string) => {
  try {
    return await database.query.user
      .findFirst({
        where: (user, { eq }) => eq(user.email, email),
      })
      .prepare("get one user by email")
      .execute();
  } catch (error) {
    console.log(error);
    throw new Error("User was not found");
  }
};
