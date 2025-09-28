import express from "express";
import pageController from "../controllers/page.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const page = express.Router();
page.get("/login", pageController.login);
page.get("/register", pageController.register);
page.get("/dashboard", authMiddleware.allRolePages, pageController.dashboard);
page.get("/settings", authMiddleware.adminRolePages, pageController.settings);

page.get(
  "/kategori-barang",
  authMiddleware.allRolePages,
  pageController.kategoriBarang
);
page.get("/materials", authMiddleware.allRolePages, pageController.materials);
page.get(
  "/import-csv-shp",
  authMiddleware.allRolePages,
  pageController.importShp
);
page.get(
  "/import-csv-shp/:id",
  authMiddleware.allRolePages,
  pageController.importShpDetails
);
page.get(
  "/history-scan",
  authMiddleware.allRolePages,
  pageController.scanHistory
);

// public pages
page.get("/materials/:id", pageController.getById);

export default page;
