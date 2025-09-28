import Joi from "joi";

const login = Joi.object({
  redirect: Joi.string().optional(),
}).required();

const dashboard = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const kategoriBarang = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const settings = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const materials = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const getById = Joi.object({
  material_id: Joi.string().required(),
  ip_address: Joi.string().required(),
});

const importShp = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const importShpDetails = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
  history_upload_id: Joi.string().required(),
});

const scanHistory = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

export default {
  login,
  dashboard,
  kategoriBarang,
  settings,
  materials,
  getById,
  importShp,
  importShpDetails,
  scanHistory,
};
