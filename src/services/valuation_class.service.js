import { database } from "../app/database.js";
import { Response } from "../class/response.js";
import { ApiError } from "../class/responseError.js";
import { validation } from "../validations/validation.js";
import valuation_classValidation from "../validations/valuation_class.validation.js";

async function create(request) {
  const result = await validation(valuation_classValidation.create, request);
  const isAlreadyExist = await database.valuation_class.count({
    where: result,
  });
  if (isAlreadyExist)
    throw new ApiError(400, "Kategori Gudang tersebut sudah ada");
  result.id = crypto.randomUUID();
  const responseCreate = await database.valuation_class.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan kategori gudang baru",
    responseCreate,
    null,
    false
  );
}

async function update(request) {
  const result = await validation(valuation_classValidation.update, request);
  const isAlreadyExist = await database.valuation_class.count({
    where: {
      id: result.id,
    },
  });
  if (!isAlreadyExist)
    throw new ApiError(400, "Kategori gudang tersebut tidak ada");

  const responseUpdate = await database.valuation_class.update({
    data: {
      valuation_description: result.valuation_description,
      valuation_class_id: result.valuation_class_id,
    },
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate kategori gudang",
    responseUpdate,
    null,
    false
  );
}

async function deletes(request) {
  const result = await validation(valuation_classValidation.deletes, request);
  const isAlreadyExist = await database.valuation_class.count({
    where: {
      id: result.id,
    },
  });
  if (!isAlreadyExist)
    throw new ApiError(400, "Kategori gudang tersebut tidak ada");

  const responseUpdate = await database.valuation_class.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil menghapus kategori gudang",
    responseUpdate,
    null,
    false
  );
}

export default { create, update, deletes };
