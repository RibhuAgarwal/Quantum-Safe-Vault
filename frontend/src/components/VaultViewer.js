import React, { useState } from "react";
import axios from "axios";

function VaultViewer() {
  const [address, setAddress] = useState("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cE2");
  const [password, setPassword] = useState("securePass2025");
  const [vault, setVault] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEthAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleFetch = async () => {
    const cleanedAddress = address.trim();
    setVault("");

    if (!isValidEthAddress(cleanedAddress)) {
      setVault("❌ Error: Invalid Ethereum address format");
      return;
    }

    setLoading(true);
    setVault("🔄 Decrypting...");

    console.log("📤 Sending to backend:", { address: cleanedAddress, password });

    try {
      const res = await axios.post("http://localhost:3001/api/vault/decrypt", {
        address: cleanedAddress,
        password
      });

      setVault("🔓 Vault: " + res.data.decrypted);
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      setVault("❌ Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
      <h2>🔐 Access Your Vault</h2>
      <input
        type="text"
        placeholder="Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Master Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <button
        onClick={handleFetch}
        disabled={loading}
        style={{
          padding: "8px 16px",
          marginTop: 8,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Decrypting..." : "Decrypt Vault"}
      </button>
      <pre style={{ textAlign: "left", marginTop: 16 }}>{vault}</pre>
    </div>
  );
}

export default VaultViewer;
