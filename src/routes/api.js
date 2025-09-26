import express from "express";
import usersController from "../controllers/users.controller.js";

const api = express.Router();
api.post("/users", usersController.register);
api.post("/users/auth", usersController.login);
export default api;
