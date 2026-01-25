const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.post("/create", sessionController.createSession);
router.get("/get", sessionController.getSession);
router.post("/updateSelectedCase", sessionController.updateSelectedCase);

module.exports = router;
