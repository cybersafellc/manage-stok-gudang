import Joi from "joi";

const create = Joi.object({
  name: Joi.string().required(),
  category_id: Joi.string().required(),
}).required();

const update = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  category_id: Joi.string().required(),
}).required();

const deletes = Joi.object({
  id: Joi.string().required(),
}).required();

const get = Joi.object({
  id: Joi.string().required(),
}).required();

export default { create, update, deletes, get };
