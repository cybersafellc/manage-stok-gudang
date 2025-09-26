import { web } from "./app/web.js";
import http from "http";
import dotenv from "dotenv";
import { logger } from "./app/logging.js";
dotenv.config();
const PORT = process.env.PORT || 3000;

const server = http.createServer(web);
server.listen(PORT, function () {
  logger.info(`Server run on : http://127.0.0.1:${PORT}`);
});
