import kategoriService from "../services/kategori.service.js";

async function create(req, res, next) {
  try {
    const response = await kategoriService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const response = await kategoriService.update(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function deletes(req, res, next) {
  try {
    const response = await kategoriService.deletes(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    req.body = req.query;
    const response = await kategoriService.get(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, update, deletes, get };
