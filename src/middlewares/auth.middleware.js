import { database } from "../app/database.js";
import { ApiError, PageError } from "../class/responseError.js";
import Jwt from "jsonwebtoken";

async function allRoleApi(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];
    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ApiError(400, "dibutuhkan akses token valid");
    req.id = await decode.id;
    req.role = await decode.role;
    const user = await database.users.count({
      where: {
        id: req.id,
      },
    });
    if (!user) {
      throw new ApiError(400, "Akun anda sudah tidak aktif!");
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function allRolePages(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];
    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) {
      res.redirect("/login?redirect=" + req.url);
      return;
    }
    req.id = await decode.id;
    req.role = await decode.role;
    const user = await database.users.count({
      where: {
        id: req.id,
      },
    });
    if (!user) {
      throw new PageError(400, "Akun anda sudah tidak aktif!");
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function adminRoleApi(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];
    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ApiError(400, "dibutuhkan akses token valid");
    if (decode.role !== "admin") throw new ApiError(403, "Akses Ditolak");
    req.id = await decode.id;
    req.role = await decode.role;
    const user = await database.users.count({
      where: {
        id: req.id,
      },
    });
    if (!user) {
      throw new ApiError(400, "Akun anda sudah tidak aktif!");
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function adminRolePages(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];
    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) {
      res.redirect("/login?redirect=" + req.url);
      return;
    }
    if (decode.role !== "admin") throw new PageError(403, "Akses Ditolak");
    req.id = await decode.id;
    req.role = await decode.role;
    const user = await database.users.count({
      where: {
        id: req.id,
      },
    });
    if (!user) {
      throw new PageError(400, "Akun anda sudah tidak aktif!");
    }
    next();
  } catch (error) {
    next(error);
  }
}

export default { allRoleApi, allRolePages, adminRoleApi, adminRolePages };
