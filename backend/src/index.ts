import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const app = new Hono();

// Define the path to the routes folder
const routesPath = join(__dirname, "routes");

// Read all files in the routes folder
readdirSync(routesPath).forEach((file) => {
  // Import each route file
  const routeFilePath = join(routesPath, file);
  const route = require(routeFilePath);
  // Register the route
  app.route(route);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
