
const express = require("express");

const {
  getMeterEnergy,
  getMeterGeo,
} = require("./services/urjaClient");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Flock Energy API",
  });
});

app.get("/api/v1/meters/:meterId/energy", async (req, res) => {
  try {
    const { meterId } = req.params;

    if (!/^J\d+$/.test(meterId)) {
      return res.status(400).json({
        error: "Invalid meter ID format",
      });
    }

    const data = await getMeterEnergy(meterId);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Energy request failed:", error.message);

    return res.status(502).json({
      error: "Unable to retrieve meter energy data",
    });
  }
});

app.get("/api/v1/meters/:meterId/geo", async (req, res) => {
  try {
    const { meterId } = req.params;

    if (!/^J\d+$/.test(meterId)) {
      return res.status(400).json({
        error: "Invalid meter ID format",
      });
    }

    const data = await getMeterGeo(meterId);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Geographic request failed:", error.message);

    return res.status(502).json({
      error: "Unable to retrieve meter geographic data",
    });
  }
});

module.exports = app;

