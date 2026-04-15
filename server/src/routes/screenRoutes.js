const express = require("express");
const {
  getAllScreens,
  createScreen,
  updateScreen,
  deleteScreen,
  scheduleScreenMessage,
} = require("../controllers/screenController");

const router = express.Router();

router.get("/", getAllScreens);
router.post("/", createScreen);
router.put("/:id", updateScreen);
router.delete("/:id", deleteScreen);
router.patch("/:id/schedule", scheduleScreenMessage);

module.exports = router;
