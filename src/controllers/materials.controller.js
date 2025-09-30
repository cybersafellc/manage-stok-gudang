import materialsService from "../services/materials.service.js";

async function create(req, res, next) {
  try {
    const response = await materialsService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function deletes(req, res, next) {
  try {
    const response = await materialsService.deletes(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const response = await materialsService.update(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function publicUpdate(req, res, next) {
  try {
    const response = await materialsService.publicUpdate(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, deletes, update, publicUpdate };
