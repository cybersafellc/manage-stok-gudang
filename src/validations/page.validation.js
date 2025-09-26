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

export default { login, dashboard, kategoriBarang, settings };
