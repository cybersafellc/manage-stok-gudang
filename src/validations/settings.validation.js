import Joi from "joi";

const addSettings = Joi.object({
  name: Joi.string().required(),
  status: Joi.boolean().required(),
}).required();

const editSettings = Joi.object({
  id: Joi.string().required(),
  status: Joi.boolean().required(),
}).required();

export default { addSettings, editSettings };
