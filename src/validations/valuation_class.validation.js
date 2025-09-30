import Joi from "joi";

const create = Joi.object({
  valuation_description: Joi.string().required(),
  valuation_class_id: Joi.string().required(),
}).required();

const update = Joi.object({
  id: Joi.string().required(),
  valuation_description: Joi.string().required(),
  valuation_class_id: Joi.string().required(),
}).required();

const deletes = Joi.object({
  id: Joi.string().required(),
}).required();

export default { create, update, deletes };
