const { Hono } = require("hono");
const { zValidator } = require("@hono/zod-validator");
const sessionController = require("../controllers/sessionController");
const {
  getSessionSchema,
  updateCaseSchema,
  deleteSessionSchema,
} = require("../validators/sessionValidators");

const sessionRoutes = new Hono();

sessionRoutes.post("/create", sessionController.createSession);

sessionRoutes.get(
  "/get",
  zValidator("query", getSessionSchema),
  sessionController.getSession,
);

sessionRoutes.post(
  "/updateSelectedCase",
  zValidator("json", updateCaseSchema),
  sessionController.updateSelectedCase,
);

sessionRoutes.post(
  "/delete",
  zValidator("json", deleteSessionSchema),
  sessionController.deleteSession,
);

module.exports = sessionRoutes;
