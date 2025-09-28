import { database } from "../app/database.js";
import { ApiError } from "../class/responseError.js";
import materialsValidation from "../validations/materials.validation.js";
import { validation } from "../validations/validation.js";
import QRCode from "qrcode";
import path from "path";
import { logger } from "../app/logging.js";
import { Response } from "../class/response.js";

async function create(request) {
  const result = await validation(materialsValidation.create, request);
  const isAlreadyExist = await database.materials.count({
    where: {
      OR: [
        {
          material_id: result.material_id,
        },
        {
          material_description: result.material_description,
        },
      ],
    },
  });
  if (isAlreadyExist) throw new ApiError(400, "Material tersebut sudah ada");
  const category_id_check = await database.category.findUnique({
    where: {
      id: result.category_id,
    },
  });
  if (!category_id_check)
    throw new ApiError(400, "category_id yang anda berikan tidak valid");
  result.id = crypto.randomUUID();
  result.jumlah = 0;
  // kodingan membuat barcode
  const barcodePath = `public/assets/img/qr/${result.id}.png`;
  QRCode.toFile(
    path.join(barcodePath),
    `${process.env.HOST}/materials/${result.id}`,
    {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "H",
    },
    function (err) {
      if (err) logger.error(err);
      else logger.info("QR dibuat: " + barcodePath);
    }
  );
  result.barcode = `/img/qr/${result.id}.png`;
  const responseCreate = await database.materials.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan material",
    responseCreate,
    null,
    false
  );
}

async function deletes(request) {
  const result = await validation(materialsValidation.deletes, request);
  const isAlreadyExist = await database.materials.count({
    where: {
      id: result.id,
    },
  });
  if (!isAlreadyExist) throw new ApiError(400, "Material tersebut tidak ada");

  const responseUpdate = await database.materials.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil menghapus material",
    responseUpdate,
    null,
    false
  );
}

export default { create, deletes };
