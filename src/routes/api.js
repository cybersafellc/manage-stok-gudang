import express from "express";
import usersController from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import settingsController from "../controllers/settings.controller.js";
import kategoriController from "../controllers/kategori.controller.js";
import materialsController from "../controllers/materials.controller.js";
import shpController from "../controllers/shp.controller.js";
import { multers } from "../middlewares/multer.middleware.js";

const api = express.Router();
api.post("/users", usersController.register);
api.post("/users/auth", usersController.login);
// api.post(
//   "/settings",
//   authMiddleware.adminRoleApi,
//   settingsController.addSettings
// );
api.put(
  "/settings",
  authMiddleware.adminRoleApi,
  settingsController.editSettings
);
api.post("/kategori", authMiddleware.allRoleApi, kategoriController.create);
api.put("/kategori", authMiddleware.allRoleApi, kategoriController.update);
api.get("/kategori", authMiddleware.allRoleApi, kategoriController.get);
api.delete("/kategori", authMiddleware.allRoleApi, kategoriController.deletes);

api.post("/materials", authMiddleware.allRoleApi, materialsController.create);
api.delete(
  "/materials",
  authMiddleware.allRoleApi,
  materialsController.deletes
);

api.post(
  "/import-csv-shp",
  authMiddleware.allRoleApi,
  multers,
  shpController.create
);

export default api;
