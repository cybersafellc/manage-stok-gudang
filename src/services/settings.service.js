import { database } from "../app/database.js";
import { Response } from "../class/response.js";
import { ApiError } from "../class/responseError.js";
import settingsValidation from "../validations/settings.validation.js";
import { validation } from "../validations/validation.js";

async function addSettings(request) {
  const result = await validation(settingsValidation.addSettings, request);
  const isAlreadyExist = await database.settings.findFirst({
    where: {
      name: result.name,
    },
  });
  if (isAlreadyExist)
    throw new ApiError(400, `Settings ${result.name} sudah ada!`);
  result.id = crypto.randomUUID();
  const responseCreate = await database.settings.create({
    data: result,
  });
  return new Response(
    200,
    "Berhasil Menambahkan Settingan Baru",
    responseCreate,
    null,
    false
  );
}

async function editSettings(request) {
  const result = await validation(settingsValidation.editSettings, request);
  const isAlreadyExist = await database.settings.findUnique({
    where: {
      id: result.id,
    },
  });
  if (!isAlreadyExist) throw new ApiError(400, "id settings tidak ditemukan");
  const respnseUpdate = await database.settings.update({
    data: {
      status: result.status,
    },
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "Berhasil menyimpan Settings",
    respnseUpdate,
    null,
    false
  );
}

export default { addSettings, editSettings };
