const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = require("./config/database");
const screenRoutes = require("./routes/screenRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5050;
// Use SERVER_HOST (not HOST) — many shells set HOST to the machine triplet, which breaks bind().
const BIND_HOST = process.env.SERVER_HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Digital Signage Dashboard API is running." });
});

app.use("/api/screens", screenRoutes);

// HTTP server instance — must stay referenced so Node keeps the process alive.
const httpServer = http.createServer(app);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  try {
    await new Promise((resolve, reject) => {
      httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

// Create DB tables automatically on startup so no manual SQL is needed.
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection established successfully.");
    await sequelize.sync();
    console.log("Database synchronized.");

    await new Promise((resolve, reject) => {
      const onListenError = (error) => {
        httpServer.off("error", onListenError);
        reject(error);
      };
      httpServer.once("error", onListenError);
      httpServer.listen(PORT, BIND_HOST, () => {
        httpServer.off("error", onListenError);
        resolve();
      });
    });

    httpServer.on("error", (error) => {
      console.error("HTTP server error:", error);
    });

    const addr = httpServer.address();
    console.log(`Server listening on http://${BIND_HOST}:${PORT}`, addr ? `(address: ${JSON.stringify(addr)})` : "");
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

void startServer();
