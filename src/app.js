const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const httpLogger = require("./middleware/loggerMiddleware");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const fileRoutes = require("./routes/fileRoutes");
const publicMenuRoutes = require("./routes/public/menu.routes");
const orderRoutes = require("./routes/order.routes");
const diningCategory = require("./routes/admin/diningCategoryRoutes");
const analyticsRoutes = require("./routes/admin/analyticsRoutes");
const inventoryRoutes = require("./routes/admin/inventoryRoutes");
const menuRoutes = require("./routes/admin/menuRoutes");
const offerRoutes = require("./routes/admin/offerRoutes");
const rosterRoutes = require("./routes/admin/rosterRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(httpLogger);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/menu", publicMenuRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin/dining", diningCategory);
app.use("/api/v1/admin/analytics", analyticsRoutes);
app.use("/api/v1/admin/inventory", inventoryRoutes);
app.use("/api/v1/admin/dining", menuRoutes);
app.use("/api/v1/admin/offers", offerRoutes);
app.use("/api/v1/admin/roster", rosterRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
