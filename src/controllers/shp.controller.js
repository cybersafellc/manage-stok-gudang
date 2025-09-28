import shpService from "../services/shp.service.js";

async function create(req, res, next) {
  try {
    req.body.user_id = await req.id;
    req.body.csv_path = await req?.file?.path;
    const response = await shpService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create };
