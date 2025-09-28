import Joi from "joi";

const create = Joi.object({
  csv_path: Joi.string().required(),
  keterangan: Joi.string().required(),
  user_id: Joi.string().required(),
}).required();

export default { create };
