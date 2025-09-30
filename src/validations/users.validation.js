import Joi from "joi";

const register = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  sap_id: Joi.string().required(),
  jabatan: Joi.string().required(),
  role: Joi.string().required(),
}).required();

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).required();

export default { register, login };
