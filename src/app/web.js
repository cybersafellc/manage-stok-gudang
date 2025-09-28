import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import api from "../routes/api.js";
import page from "../routes/pages.js";
import path from "path";
import errorMiddleware from "../middlewares/error.middleware.js";
import requestIp from "request-ip";

import ejs from "ejs";

export const web = express();

// set Config
web.set("proxy trust", true);
web.use(requestIp.mw());
web.engine("html", ejs.renderFile);
web.set("view engine", "html");
web.set("views", path.join("public/views"));
web.use("/", express.static("public/assets"));

// support Globas Middleware
web.use(cors());
web.use(cookieParser());
web.use(bodyParser.json());

// route
web.use("/api", api);
web.use(page);

// error middleware
web.use(errorMiddleware.notFoundRoute);
web.use(errorMiddleware.errorException);
