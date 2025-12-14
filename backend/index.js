require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require("./Route/router");
const connectDB = require("./DB/connnection");

const app = express();
const port = process.env.PORT;

app.use(helmet()); // Use helmet middleware for security

// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://www.softerint.com",
      "http://localhost:5173",
      "https://localhost:5173",
      "https://nakshpath.com",
      "https://www.nakshpath.com",
      "https://admin.nakshpath.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", router);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* Start server only after DB connects */
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
