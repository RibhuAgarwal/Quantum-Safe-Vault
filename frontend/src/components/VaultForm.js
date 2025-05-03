import React, { useState } from "react";
import axios from "axios";

function VaultForm() {
  const [address, setAddress] = useState("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cE2");
  const [password, setPassword] = useState("securePass2025");
  const [data, setData] = useState("Confidential notes for Project Titan.");
  const [zkHash, setZkHash] = useState("0x546974616e5a4b68617368323032350000000000000000000000000000000000");  
  const [message, setMessage] = useState("");

  // ✅ Clean and format Ethereum address
  const cleanAddress = (raw) =>
    raw.trim().toLowerCase().replace(/[^0-9a-fx]/gi, "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sanitizedAddress = cleanAddress(address);

      const res = await axios.post("http://localhost:3001/api/vault/create", {
        address: sanitizedAddress,
        password,
        data,
        zkHash
      });

      setMessage("✅ Vault created: " + res.data.ipfsHash);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Create Vault</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ethereum Address"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Vault Data"
          required
        />
        <input
          value={zkHash}
          onChange={(e) => setZkHash(e.target.value)}
          placeholder="ZK Hash"
        />
        <button type="submit">Encrypt & Store</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default VaultForm;
