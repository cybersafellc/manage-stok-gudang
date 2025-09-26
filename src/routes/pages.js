import express from "express";
import pageController from "../controllers/page.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const page = express.Router();
page.get("/login", pageController.login);
page.get("/register", pageController.register);
page.get("/dashboard", authMiddleware.allRolePages, pageController.dashboard);
page.get(
  "/kategori-barang",
  authMiddleware.allRolePages,
  pageController.kategoriBarang
);
page.get("/settings", authMiddleware.allRolePages, pageController.settings);
export default page;
