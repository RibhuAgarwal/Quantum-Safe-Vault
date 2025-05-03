require("dotenv").config();
const express = require("express");
const cors = require("cors");

const vaultRoutes = require("./routes/vaultRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vault", vaultRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
