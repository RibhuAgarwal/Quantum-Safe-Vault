const axios = require("axios");
const FormData = require("form-data");

// 📤 Upload encrypted data to IPFS via local node
exports.uploadToIPFS = async (data) => {
  try {
    const form = new FormData();
    form.append("file", data); // Data must be string

    const response = await axios.post("http://localhost:5001/api/v0/add", form, {
      headers: {
        ...form.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    if (response.data?.Hash) {
      console.log("✅ IPFS upload successful:", response.data.Hash);
      return response.data.Hash;
    }

    throw new Error("Invalid IPFS response");
  } catch (err) {
    console.error("❌ IPFS upload failed:", err.message || err);
    throw err;
  }
};

// 📥 Download encrypted data from IPFS
exports.fetchFromIPFS = async (cid) => {
  const localGatewayURL = `http://localhost:8080/ipfs/${cid}`;
  const fallbackAPI = "http://localhost:5001/api/v0/cat";

  try {
    const res = await axios.get(localGatewayURL, {
      timeout: 7000,
      responseType: "text",
    });

    console.log("✅ Fetched from local IPFS gateway:", cid);
    return res.data;
  } catch (err) {
    console.warn("⚠️ Local IPFS gateway failed:", err.message);

    try {
      const res = await axios.post(fallbackAPI, null, {
        params: { arg: cid },
        responseType: "text",
      });

      console.log("✅ Fetched from IPFS fallback API:", cid);
      return typeof res.data === "string"
        ? res.data
        : Buffer.from(res.data).toString("utf-8");

    } catch (fallbackErr) {
      console.error("❌ IPFS fetch failed (fallback too):", fallbackErr.message);
      throw fallbackErr;
    }
  }
};
