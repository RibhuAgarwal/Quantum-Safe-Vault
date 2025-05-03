// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultManager {
    struct Vault {
        string ipfsHash;
        bytes32 zkAuthHash;
    }

    mapping(address => Vault) private vaults;

    event VaultCreated(address indexed user, string ipfsHash);
    event VaultUpdated(address indexed user, string ipfsHash);

    // 🔐 Create a vault for a user
    function createVault(address _user, string memory _ipfsHash, bytes32 _zkAuthHash) public {
        require(bytes(vaults[_user].ipfsHash).length == 0, "Vault already exists");
        vaults[_user] = Vault(_ipfsHash, _zkAuthHash);
        emit VaultCreated(_user, _ipfsHash);
    }

    // ✏️ Update vault
    function updateVault(address _user, string memory _ipfsHash, bytes32 _zkAuthHash) public {
        require(bytes(vaults[_user].ipfsHash).length != 0, "Vault not found");
        vaults[_user] = Vault(_ipfsHash, _zkAuthHash);
        emit VaultUpdated(_user, _ipfsHash);
    }

    // 📤 Get vault data
    function getVault(address _user) public view returns (string memory, bytes32) {
        Vault memory vault = vaults[_user];
        return (vault.ipfsHash, vault.zkAuthHash);
    }
}
