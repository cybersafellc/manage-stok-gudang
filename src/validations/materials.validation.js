import Joi from "joi";

const create = Joi.object({
  category_id: Joi.string().required(),
  material_id: Joi.string().required(),
  material_description: Joi.string().required(),
  satuan: Joi.string().required(),
}).required();

const deletes = Joi.object({
  id: Joi.string().required(),
}).required();

export default { create, deletes };
