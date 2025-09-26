import { logger } from "../src/app/logging.js";

describe("logging testing", function () {
  it("info", async function () {
    logger.info("Info ");
  });

  it("Warn", async function () {
    logger.warn("Info");
  });

  it("Error", async function () {
    logger.error("Error");
  });
});
