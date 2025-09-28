import { database } from "../app/database.js";
import { Response } from "../class/response.js";
import { ApiError } from "../class/responseError.js";
import kategoriValidation from "../validations/kategori.validation.js";
import { validation } from "../validations/validation.js";

async function create(request) {
  const result = await validation(kategoriValidation.create, request);
  const isAlreadyExist = await database.category.count({
    where: {
      name: result.name,
      category_id: result.category_id,
    },
  });
  if (isAlreadyExist) throw new ApiError(400, "Kategori tersebut sudah ada");
  result.id = crypto.randomUUID();
  const responseCreate = await database.category.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan kategori baru",
    responseCreate,
    null,
    false
  );
}

async function update(request) {
  const result = await validation(kategoriValidation.update, request);
  const isAlreadyExist = await database.category.count({
    where: {
      id: result.id,
    },
  });
  if (!isAlreadyExist) throw new ApiError(400, "Kategori tersebut tidak ada");

  const responseUpdate = await database.category.update({
    data: {
      name: result.name,
      category_id: result.category_id,
    },
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate kategori",
    responseUpdate,
    null,
    false
  );
}

async function deletes(request) {
  const result = await validation(kategoriValidation.deletes, request);
  const isAlreadyExist = await database.category.count({
    where: {
      id: result.id,
    },
  });
  if (!isAlreadyExist) throw new ApiError(400, "Kategori tersebut tidak ada");

  const responseUpdate = await database.category.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil menghapus kategori",
    responseUpdate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(kategoriValidation.get, request);
  const isAlreadyExist = await database.category.count({
    where: result,
  });
  if (!isAlreadyExist) throw new ApiError(400, "Kategori tersebut tidak ada");

  const category = await database.category.findUnique({
    where: {
      id: result.id,
    },
  });
  return new Response(200, "berikut details kategori", category, null, false);
}

export default { create, update, deletes, get };
