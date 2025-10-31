import { Hono } from "hono";
import { cors } from "hono/cors";
// import authRoutes from "./middleware/auth";
import userRoutes from "./routes/users";
import teeTimeRoutes from "./routes/tee-time";
import monitorRoutes from "./routes/monitor";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));

// Health check
app.get("/api/", (c) => c.json({ name: "Tee Time Monitor API", status: "healthy" }));

// Routes
// app.route("/api/auth", authRoutes);
app.route("/api/users", userRoutes);
app.route("/api/monitor", monitorRoutes);
app.route("/api", teeTimeRoutes);

export default app;
