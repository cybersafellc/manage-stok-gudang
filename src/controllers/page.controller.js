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

export default { login, register, dashboard, kategoriBarang, settings };
