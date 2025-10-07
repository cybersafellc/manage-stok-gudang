import { database } from "../app/database.js";
import { Response } from "../class/response.js";
import { PageError } from "../class/responseError.js";
import pageValidation from "../validations/page.validation.js";
import { validation } from "../validations/validation.js";

async function login(request) {
  const result = await validation(pageValidation.login, request);
  return new Response(200, "Monitoring Stok Gudang", result, "login", false);
}

async function register() {
  const isOpen = await database.settings.findFirst({
    where: {
      name: "Pendaftaran Pengguna/User",
    },
  });

  if (!isOpen || !isOpen.status)
    throw new PageError(
      403,
      "Pendaftaran pengguna ditutup, silahkan hubungi admin"
    );

  const admin_allow_register = await database.settings.findFirst({
    where: {
      name: "Pendaftaran Admin",
    },
  });
  return new Response(
    200,
    "Monitoring Stok Gudang",
    { admin_allow_register },
    "register",
    false
  );
}

async function dashboard(request) {
  const result = await validation(pageValidation.dashboard, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const history_upload = await database.history_upload.findMany({
    orderBy: {
      update_at: "desc",
    },
    include: {
      user: true,
      details_upload: true,
    },
  });
  const total_material = await database.materials.count();
  const total_upload_sap = await database.history_upload.count();
  const total_scan_history = await database.scan_history.count();
  const total_category = await database.category.count();
  return new Response(
    200,
    "dashboard",
    {
      user,
      total_material,
      total_upload_sap,
      total_scan_history,
      total_category,
      history_upload,
    },
    "dashboard",
    false
  );
}

async function kategoriBarang(request) {
  const result = await validation(pageValidation.kategoriBarang, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const kategori = await database.category.findMany({
    orderBy: {
      update_at: "desc",
    },
  });
  return new Response(
    200,
    "kategori barang",
    { user, kategori },
    "kategori_barang",
    false
  );
}

async function kategoriGudang(request) {
  const result = await validation(pageValidation.kategoriGudang, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const kategori = await database.valuation_class.findMany({
    orderBy: {
      update_at: "desc",
    },
  });
  return new Response(
    200,
    "Kategori Gudang",
    { user, kategori },
    "kategori_gudang",
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
  const settings = await database.settings.findMany();
  return new Response(200, "settings", { user, settings }, "settings", false);
}

async function materials(request) {
  const result = await validation(pageValidation.materials, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const material = await database.materials.findMany({
    orderBy: {
      update_at: "desc",
    },
    include: {
      category: true,
      valuation_class: true,
    },
  });

  const kategori = await database.category.findMany({
    orderBy: {
      update_at: "desc",
    },
  });

  const kategori_gudang = await database.valuation_class.findMany({
    orderBy: {
      update_at: "desc",
    },
  });
  return new Response(
    200,
    "Materials",
    { user, material, kategori, kategori_gudang },
    "materials",
    false
  );
}

async function getById(request) {
  console.log(request);
  const result = await validation(pageValidation.getById, request);

  let user;
  if (result?.id) {
    user = await database.users.findUnique({
      where: {
        id: result.id,
      },
    });
  }

  const material = await database.materials.findUnique({
    where: {
      id: result.material_id,
    },
    include: {
      category: true,
      valuation_class: true,
    },
  });

  if (!material) throw new PageError(404, "Page Not Found");

  await database.scan_history.create({
    data: {
      id: crypto.randomUUID(),
      ip_address: result.ip_address,
      materials_id: result.material_id,
    },
  });
  return new Response(
    200,
    "Materials",
    { material, user, path: `/materials/${material.id}` },
    "materials_id",
    false
  );
}

async function importShp(request) {
  const result = await validation(pageValidation.materials, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const history_upload = await database.history_upload.findMany({
    orderBy: {
      update_at: "desc",
    },
    include: {
      details_upload: {
        include: {
          materials: true,
        },
      },

      user: true,
    },
  });
  return new Response(
    200,
    "Import CSV SHP",
    { user, history_upload },
    "import_csv_shp",
    false
  );
}

async function importShpDetails(request) {
  const result = await validation(pageValidation.importShpDetails, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const history_upload = await database.history_upload.findUnique({
    where: {
      id: result.history_upload_id,
    },
    include: {
      details_upload: {
        include: {
          materials: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          update_at: "desc",
        },
      },
      user: true,
    },
  });
  if (!history_upload) throw new PageError(404, "Page Not Found");
  return new Response(
    200,
    "Details CSV SHP",
    { user, history_upload },
    "import_csv_shp_details",
    false
  );
}

async function scanHistory(request) {
  const result = await validation(pageValidation.scanHistory, request);
  const user = await database.users.findUnique({
    where: {
      id: result.id,
    },
  });
  const history_scan = await database.scan_history.findMany({
    orderBy: {
      update_at: "desc",
    },
    include: {
      materials: {
        include: {
          category: true,
        },
      },
    },
  });
  return new Response(
    200,
    "History Scan Material",
    { user, history_scan },
    "history_scan",
    false
  );
}

export default {
  login,
  register,
  dashboard,
  kategoriBarang,
  settings,
  materials,
  getById,
  importShp,
  importShpDetails,
  scanHistory,
  kategoriGudang,
};
