import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getAllUsers, newUser } from "@/services/UserService";
import { UserFilters, insertUserSchema } from "@/types";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.get("/", (c) => {
  const { page, from, to, by, dir } = c.req.query();
  try {
    let num = 1;
    if (Number(page).toString().toLowerCase() !== "nan") num = Number(page);
    const date =
      from && to ? { from: new Date(from), to: new Date(to) } : undefined;
    const order =
      by || dir ? ({ column: by, direction: dir } as UserFilters) : undefined;
    const data = getAllUsers(num, date, order);
    return c.json(data);
  } catch (error) {
    console.error(error);
    return c.newResponse(JSON.stringify(error), 500);
  }
});

app.post("/", zValidator("json", insertUserSchema), async (c) => {
  const { req } = c;

  const body = req.valid("json");
  try {
    const data = newUser(body);
    return c.newResponse(JSON.stringify(data), 200);
  } catch (error) {
    console.error(error);
    return c.newResponse(JSON.stringify(error), 500);
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
