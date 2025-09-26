import { logger } from "../app/logging.js";
import { Response } from "../class/response.js";
import { ApiError, PageError } from "../class/responseError.js";

async function notFoundRoute(req, res, next) {
  try {
    throw new PageError(404, "Page Not Found");
  } catch (error) {
    next(error);
  }
}

async function errorException(err, req, res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof PageError) {
    const response = new Response(err.status, err.message, null, null, true);
    res.status(response.status).render("error", response);
  } else if (err instanceof ApiError) {
    const response = new Response(err.status, err.message, null, null, true);
    res.status(response.status).json(response).end();
  } else {
    const response = new Response(500, "Internal Error", null, null, true);
    res.status(response.status).render("error", response);
    logger.error(err.message);
  }
}

export default { notFoundRoute, errorException };
