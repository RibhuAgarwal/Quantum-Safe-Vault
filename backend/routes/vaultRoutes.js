const express = require("express");
const router = express.Router();
const vaultController = require("../controllers/vaultController");

router.post("/create", vaultController.createVault);
router.post("/decrypt", vaultController.decryptVault);
router.get("/get/:address", vaultController.getVault);

module.exports = router;
