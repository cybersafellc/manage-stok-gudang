import usersService from "../services/users.service.js";

async function register(req, res, next) {
  try {
    const response = await usersService.register(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const response = await usersService.login(req.body);
    res.cookie("access_token", response.data.access_token);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { register, login };
