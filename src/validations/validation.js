import { ApiError } from "../class/responseError.js";

function validation(schema, request) {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ApiError(400, result.error.message);
  } else {
    return result.value;
  }
}

export { validation };
