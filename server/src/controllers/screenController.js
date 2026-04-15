const Screen = require("../models/screen");

const buildLastUpdated = () => ({
  lastUpdated: new Date(),
});

const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(screens);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch screens.", error: error.message });
  }
};

const createScreen = async (req, res) => {
  try {
    const { name, location, content } = req.body;

    if (!name || !location || typeof content !== "string") {
      return res.status(400).json({
        message: "Name, location, and content are required.",
      });
    }

    const newScreen = await Screen.create({
      name,
      location,
      content,
      status: "offline",
      ...buildLastUpdated(),
    });

    return res.status(201).json(newScreen);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create screen.", error: error.message });
  }
};

const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status } = req.body;

    const screen = await Screen.findByPk(id);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found." });
    }

    if (typeof content === "string") {
      screen.content = content;
    }

    if (status && ["online", "offline"].includes(status)) {
      screen.status = status;
    }

    screen.lastUpdated = new Date();
    await screen.save();

    return res.status(200).json(screen);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update screen.", error: error.message });
  }
};

const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findByPk(id);

    if (!screen) {
      return res.status(404).json({ message: "Screen not found." });
    }

    await screen.destroy();
    return res.status(200).json({ message: "Screen deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete screen.", error: error.message });
  }
};

const scheduleScreenMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledMessage, scheduledTime } = req.body;

    const screen = await Screen.findByPk(id);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found." });
    }

    if (!scheduledMessage || !scheduledTime) {
      return res.status(400).json({
        message: "Both scheduledMessage and scheduledTime are required.",
      });
    }

    screen.scheduledMessage = scheduledMessage;
    screen.scheduledTime = new Date(scheduledTime);
    screen.lastUpdated = new Date();
    await screen.save();

    return res.status(200).json(screen);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to schedule message.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllScreens,
  createScreen,
  updateScreen,
  deleteScreen,
  scheduleScreenMessage,
};
