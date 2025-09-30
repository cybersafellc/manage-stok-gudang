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
      category_id: result.category_id,
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

  const kategori_gudang = await database.valuation_class.findUnique({
    where: {
      id: result.valuation_class_id,
    },
  });
  if (!kategori_gudang)
    throw new ApiError(400, "kategori gudang yang anda berikan tidak valid");

  result.id = crypto.randomUUID();
  result.jumlah = 0;
  result.jumlah_stok_fisik = 0;
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

async function update(request) {
  const result = await validation(materialsValidation.update, request);
  const check = await database.materials.findUnique({
    where: {
      id: result.id,
    },
  });
  if (!check) throw new ApiError(400, "id material tidak valid");

  if (
    check.category_id !== result.category_id ||
    check.material_id !== result.material_id
  ) {
    const isAlreadyExist = await database.materials.count({
      where: {
        material_id: result.material_id,
        category_id: result.category_id,
      },
    });

    if (isAlreadyExist)
      throw new ApiError(
        400,
        "Material tersebut sudah ada, mengakibatkan bentrok material id"
      );
  }

  if (check.material_description != result.material_description) {
    const checkAgain = await database.materials.count({
      where: {
        material_description: result.material_description,
        category_id: result.category_id,
      },
    });
    if (checkAgain) throw new ApiError(400, "Nama material tersebut sudah ada");
  }

  const category_id_check = await database.category.findUnique({
    where: {
      id: result.category_id,
    },
  });
  if (!category_id_check)
    throw new ApiError(400, "category_id yang anda berikan tidak valid");

  const kategori_gudang = await database.valuation_class.findUnique({
    where: {
      id: result.valuation_class_id,
    },
  });
  if (!kategori_gudang)
    throw new ApiError(400, "kategori gudang yang anda berikan tidak valid");
  // update exe
  const responseCreate = await database.materials.update({
    data: result,
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate material",
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
async function publicUpdate(request) {
  const result = await validation(materialsValidation.publicUpdate, request);
  const count = await database.materials.count({
    where: {
      id: result.id,
    },
  });
  if (!count) throw new ApiError(400, "id material tersebut tidak ada");
  const updateResponse = await database.materials.update({
    data: result,
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "Berhasil update Stok & Lokasi Rak",
    updateResponse,
    null,
    false
  );
}

export default { create, deletes, update, publicUpdate };
