import pageService from "../services/page.service.js";

async function login(req, res, next) {
  try {
    const { redirect } = await req.query;
    const response = await pageService.login({
      redirect: redirect || "/dashboard",
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const response = await pageService.register();
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function dashboard(req, res, next) {
  try {
    const response = await pageService.dashboard({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function kategoriBarang(req, res, next) {
  try {
    const response = await pageService.kategoriBarang({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function settings(req, res, next) {
  try {
    const response = await pageService.settings({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function materials(req, res, next) {
  try {
    const response = await pageService.materials({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const response = await pageService.getById({
      material_id: await req.params.id,
      ip_address: await req.clientIp,
      id: await req.id,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function importShp(req, res, next) {
  try {
    const response = await pageService.importShp({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function importShpDetails(req, res, next) {
  try {
    const response = await pageService.importShpDetails({
      id: req.id,
      role: req.role,
      history_upload_id: req.params.id,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function scanHistory(req, res, next) {
  try {
    const response = await pageService.scanHistory({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
}

async function kategoriGudang(req, res, next) {
  try {
    const response = await pageService.kategoriGudang({
      id: req.id,
      role: req.role,
    });
    res.status(response.status).render(response.refrence, response);
  } catch (error) {
    next(error);
  }
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
