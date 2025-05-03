
import React from "react";
import VaultForm from "./components/VaultForm";
import VaultViewer from "./components/VaultViewer";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔐 Quantum-Safe Password Manager</h1>
      <VaultForm />
      <hr />
      <VaultViewer />
    </div>
  );
}

export default App;
