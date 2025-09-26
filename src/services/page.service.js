import { database } from "../app/database.js";
import { Response } from "../class/response.js";
import pageValidation from "../validations/page.validation.js";
import { validation } from "../validations/validation.js";

async function login(request) {
  const result = await validation(pageValidation.login, request);
  return new Response(200, "Monitoring Stok Gudang", result, "login", false);
}

async function register() {
  return new Response(200, "Monitoring Stok Gudang", null, "register", false);
}

async function dashboard(request) {
  const result = await validation(pageValidation.dashboard, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  return new Response(200, "dashboard", { user }, "dashboard", false);
}

async function kategoriBarang(request) {
  const result = await validation(pageValidation.kategoriBarang, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "kategori barang",
    { user },
    "kategori_barang",
    false
  );
}

async function settings(request) {
  const result = await validation(pageValidation.settings, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  return new Response(200, "settings", { user }, "settings", false);
}

export default { login, register, dashboard, kategoriBarang, settings };
