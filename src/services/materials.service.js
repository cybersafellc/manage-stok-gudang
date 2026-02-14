import { database } from "../app/database.js";
import { ApiError } from "../class/responseError.js";
import materialsValidation from "../validations/materials.validation.js";
import { validation } from "../validations/validation.js";
import QRCode from "qrcode";
import path from "path";
import { logger } from "../app/logging.js";
import { Response } from "../class/response.js";
import fs from "fs/promises";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { drawCell, getRowHeight } from "../app/utils.js";

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
    },
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
    false,
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
        "Material tersebut sudah ada, mengakibatkan bentrok material id",
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
    false,
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
    false,
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
    false,
  );
}

async function qrUpdate() {
  const materials = await database.materials.findMany();
  for (const material of materials) {
    const barcodePath = `public/assets/img/qr/${material.id}.png`;
    await fs.unlink(barcodePath);
    QRCode.toFile(
      path.join(barcodePath),
      `${process.env.HOST}/materials/${material.id}`,
      {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      },
      function (err) {
        if (err) logger.error(err);
        else logger.info("QR dibuat: " + barcodePath);
      },
    );
  }
  return new Response(200, "berhasil mengupdate qr code", null, null, false);
}

async function genereateMaterialsReport() {
  const data = await database.materials.findMany({
    orderBy: {
      update_at: "desc",
    },
    include: {
      category: true,
    },
  });
  const filesLocation = `/pdf/${crypto.randomUUID()}.pdf`;
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    bufferPages: true, // penting untuk footer aman
  });

  doc.pipe(createWriteStream("public/assets" + filesLocation));

  /* ================= HEADER ================= */
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("PT Aneka Inti Persada\nPinang Sebatang Estate\n");
  doc.fontSize(18).text("LAPORAN DATA MATERIAL\n", { align: "center" });
  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Periode: " + new Date().getFullYear(), {
      align: "center",
    });

  doc.moveDown(0.8);
  doc
    .moveTo(40, doc.y)
    .lineTo(doc.page.width - 40, doc.y)
    .stroke();

  /* ================= TABLE CONFIG ================= */
  let y = doc.y + 15;
  const startX = 40;
  const usableWidth = doc.page.width - 80;

  const colRatio = {
    no: 0.06,
    kode: 0.16,
    desc: 0.36,
    satuan: 0.1,
    qty: 0.08,
    fisik: 0.08,
    lokasi: 0.16,
  };

  const colW = Object.fromEntries(
    Object.entries(colRatio).map(([key, ratio]) => [key, usableWidth * ratio]),
  );

  const colX = {};
  let currentX = startX;
  for (let key of Object.keys(colW)) {
    colX[key] = currentX;
    currentX += colW[key];
  }

  const colWidthsArray = Object.values(colW);

  /* ================= DRAW TABLE HEADER ================= */
  function drawHeader() {
    const headerHeight = 28;
    doc.font("Helvetica-Bold");

    drawCell(doc, "No", colX.no, y, colW.no, headerHeight, { align: "center" });
    drawCell(doc, "Kode Material", colX.kode, y, colW.kode, headerHeight);
    drawCell(doc, "Material Deskripsi", colX.desc, y, colW.desc, headerHeight);
    drawCell(doc, "Satuan", colX.satuan, y, colW.satuan, headerHeight);
    drawCell(doc, "Stok SAP", colX.qty, y, colW.qty, headerHeight, {
      align: "right",
    });
    drawCell(doc, "Stok Fisik", colX.fisik, y, colW.fisik, headerHeight, {
      align: "right",
    });
    drawCell(doc, "Lokasi", colX.lokasi, y, colW.lokasi, headerHeight);

    y += headerHeight;
    doc.font("Helvetica");
  }

  drawHeader();

  /* ================= BODY ================= */
  data.forEach((item, i) => {
    const kodeGabungan = `${item.category?.category_id ?? ""}${item.material_id ?? ""}`;

    const rowTexts = [
      (i + 1).toString(),
      kodeGabungan,
      item.material_description,
      item.satuan,
      item.jumlah?.toString(),
      item.jumlah_stok_fisik?.toString(),
      item.location,
    ];

    const rowHeight = getRowHeight(doc, rowTexts, colWidthsArray);

    if (y + rowHeight > doc.page.height - 60) {
      doc.addPage();
      y = 50;
      drawHeader();
    }

    // zebra row
    if (i % 2 === 0) {
      doc.rect(startX, y, usableWidth, rowHeight).fill("#f9f9f9");
      doc.fillColor("#000");
    }

    drawCell(doc, rowTexts[0], colX.no, y, colW.no, rowHeight, {
      align: "center",
    });
    drawCell(doc, rowTexts[1], colX.kode, y, colW.kode, rowHeight);
    drawCell(doc, rowTexts[2], colX.desc, y, colW.desc, rowHeight);
    drawCell(doc, rowTexts[3], colX.satuan, y, colW.satuan, rowHeight);
    drawCell(doc, rowTexts[4], colX.qty, y, colW.qty, rowHeight, {
      align: "right",
    });
    drawCell(doc, rowTexts[5], colX.fisik, y, colW.fisik, rowHeight, {
      align: "right",
    });
    drawCell(doc, rowTexts[6], colX.lokasi, y, colW.lokasi, rowHeight);

    y += rowHeight;
  });

  /* ================= FOOTER (SAFE, NO RECURSION) ================= */
  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(9)
      .fillColor("#555")
      .text(
        `Halaman ${i - range.start + 1} dari ${range.count}`,
        40,
        doc.page.height - 30,
        { align: "center", width: doc.page.width - 80 },
      );
  }

  doc.end();
  return new Response(
    200,
    "berhasil Menggenerate Laporan",
    {
      path_download: filesLocation,
    },
    null,
    false,
  );
}

export default {
  create,
  deletes,
  update,
  publicUpdate,
  qrUpdate,
  genereateMaterialsReport,
};
