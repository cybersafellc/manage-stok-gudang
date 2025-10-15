import { Response } from "../class/response.js";
import shpValidation from "../validations/shp.validation.js";
import { validation } from "../validations/validation.js";
import { promises as fs } from "fs";
import { Readable } from "stream";
import csv from "csv-parser";
import iconv from "iconv-lite";
import { ApiError } from "../class/responseError.js";
import { database } from "../app/database.js";

async function create(request) {
  const result = await validation(shpValidation.create, request);
  //   check csv extention
  if (result.csv_path.split(".")[1] !== "csv")
    throw new ApiError(400, "Hanya File CSV yang diterima");
  // parser tu array and object
  const data = await readCSV(result.csv_path);
  //   check duplicate
  const duplicateCheck = await getDuplicateMaterials(data);
  if (duplicateCheck[0])
    throw new ApiError(
      400,
      `Terdeteksi Duplikat ID Material / Kode Material : ${duplicateCheck.join(
        ","
      )}`
    );
  // check valid data on database
  let invalid = [];
  for (const material of data) {
    const ids = splitIDMaterial(material.Material);
    const isValidMaterialID = await database.materials.count({
      where: {
        material_id: ids[1],
        category: {
          category_id: ids[0],
        },
      },
    });
    if (!isValidMaterialID) invalid.push(material.Material);
  }
  if (invalid[0])
    throw new ApiError(
      400,
      `Beberapa ID Material / Kode Material tidak Terdaftar di database :\n${invalid.join(
        "\n"
      )}`
    );
  // update jumlah materials or execute
  const responseAddHistoryUpload = await database.history_upload.create({
    data: {
      id: crypto.randomUUID(),
      keterangan: result.keterangan,
      user_id: result.user_id,
    },
  });
  // set 0 all sap jumlah
  await database.materials.updateMany({
    data: {
      jumlah: 0,
    },
  });
  //
  for (const material of data) {
    let jumlahStr = material["Jumlah SAP"];
    let jumlahFloat = parseFloat(jumlahStr.replace(/,/g, ""));
    const ids = splitIDMaterial(material.Material);
    const responseUpdate = await database.materials.update({
      data: {
        jumlah: jumlahFloat,
      },
      where: {
        material_id: ids[1],
      },
    });
    await database.details_upload.create({
      data: {
        id: crypto.randomUUID(),
        history_upload_id: responseAddHistoryUpload.id,
        materials_id: responseUpdate.id,
        jumlah: jumlahFloat,
      },
    });
  }
  return new Response(
    200,
    "berhasil mengupdate jumlah material berdasarkan file SAP",
    responseAddHistoryUpload,
    null,
    false
  );
}

export default { create };

//
async function readCSV(path) {
  const buffer = await fs.readFile(path);

  // Deteksi encoding via BOM
  let encoding = "utf8";
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    encoding = "utf16le"; // UTF-16 Little Endian
  } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    encoding = "utf16be"; // UTF-16 Big Endian
  } else if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    encoding = "utf8"; // UTF-8 with BOM
  }

  console.log("Encoding terdeteksi:", encoding);

  // Decode buffer ke string sesuai encoding
  const file = iconv.decode(buffer, encoding);

  return new Promise((resolve, reject) => {
    const results = [];

    const stream = Readable.from(file);

    stream
      .pipe(csv({ separator: file.includes("\t") ? "\t" : "," }))
      .on("data", (row) => {
        // hanya ambil kolom tertentu
        results.push({
          Material: row["Material"] ?? null,
          "Jumlah SAP": row["Jumlah SAP"] ?? null,
        });
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

function getDuplicateMaterials(data) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of data) {
    if (seen.has(item.Material)) {
      duplicates.add(item.Material);
    } else {
      seen.add(item.Material);
    }
  }

  return Array.from(duplicates);
}

function splitIDMaterial(numStr) {
  // pastikan string
  const str = String(numStr);

  const firstPart = str.slice(0, 4); // ambil 4 digit pertama
  const secondPart = str.slice(4); // ambil sisanya

  return [firstPart, secondPart];
}
