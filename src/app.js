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
const diningCategory = require("./routes/admin/diningCategoryRoutes");
const analyticsRoutes = require("./routes/admin/analyticsRoutes");
const menuRoutes = require("./routes/admin/menuRoutes");
const offerRoutes = require("./routes/admin/offerRoutes");
const rosterRoutes = require("./routes/admin/rosterRoutes");
const ordersRoutes = require("./routes/orders/ordersRoutes");
const categoryRoutes = require("./routes/public/categories.routes");
const addressRoutes = require("./routes/addressRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const combsRoutes = require("./routes/admin/comboRoutes");
const adminOrderRoutes = require("./routes/admin/adminOrderRoutes");
const enquiryRoutes =require("./routes/enquiryRoutes")
const router = require("express").Router();

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
app.use("/api/v1/admin/dining", diningCategory);
app.use("/api/v1/admin/analytics", analyticsRoutes);
app.use("/api/v1/admin/dining", menuRoutes);
app.use("/api/v1/admin/offers", offerRoutes);
app.use("/api/v1/admin/roster", rosterRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/admin/dining", combsRoutes);
app.use("/api/v1/admin/dining", adminOrderRoutes);
app.use("/api/v1/enquiries", enquiryRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
