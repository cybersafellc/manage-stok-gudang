import Joi from "joi";

const create = Joi.object({
  category_id: Joi.string().required(),
  material_id: Joi.string().required(),
  valuation_class_id: Joi.string().required(),
  material_description: Joi.string().required(),
  satuan: Joi.string().required(),
  location: Joi.string().required(),
}).required();

const update = Joi.object({
  id: Joi.string().required(),
  category_id: Joi.string().required(),
  material_id: Joi.string().required(),
  valuation_class_id: Joi.string().required(),
  material_description: Joi.string().required(),
  jumlah: Joi.number().required(),
  jumlah_stok_fisik: Joi.number().required(),
  satuan: Joi.string().required(),
  location: Joi.string().required(),
}).required();

const deletes = Joi.object({
  id: Joi.string().required(),
}).required();

const publicUpdate = Joi.object({
  id: Joi.string().required(),
  jumlah_stok_fisik: Joi.number().required(),
  location: Joi.string().required(),
}).required();

export default { create, deletes, update, publicUpdate };
