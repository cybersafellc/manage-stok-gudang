import settingsService from "../services/settings.service.js";

async function addSettings(req, res, next) {
  try {
    const response = await settingsService.addSettings(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function editSettings(req, res, next) {
  try {
    const response = await settingsService.editSettings(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { addSettings, editSettings };
