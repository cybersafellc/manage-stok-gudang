import { database } from "../app/database.js";
import { Response } from "../class/response.js";
import { ApiError } from "../class/responseError.js";
import usersValidation from "../validations/users.validation.js";
import { validation } from "../validations/validation.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

async function register(request) {
  const result = await validation(usersValidation.register, request);
  const isAlready = await database.users.count({
    where: {
      username: result.username,
    },
  });
  if (isAlready)
    throw new ApiError(
      400,
      `username ${result.username} sudah terdaftar, silahkan login!`
    );
  result.id = crypto.randomUUID();
  result.password = await bcrypt.hash(result.password, 10);
  const responseCreate = await database.users.create({
    data: result,
    select: {
      id: true,
      username: true,
      name: true,
      jabatan: true,
      role: true,
      create_at: true,
    },
  });
  return new Response(
    200,
    "berhasil register, silahkan login!",
    responseCreate,
    "/login",
    false
  );
}

async function login(request) {
  const result = await validation(usersValidation.login, request);
  const user = await database.users.findFirst({
    where: {
      username: result.username,
    },
  });
  if (user && (await bcrypt.compare(result.password, user.password))) {
    const access_token = await Jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.AUTH_TOKEN,
      {
        expiresIn: "8h",
      }
    );
    return new Response(200, "berhasil login", { access_token }, null, false);
  } else {
    throw new ApiError(400, "Username dan Password tidak valid!");
  }
}

export default { register, login };
