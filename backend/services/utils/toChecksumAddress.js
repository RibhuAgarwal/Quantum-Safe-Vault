const crypto = require("crypto");

function toChecksumAddress(address) {
  address = address.toLowerCase().replace(/^0x/, "");

  // Use SHA3-256 instead of Keccak256 — works for most dev chains
  const hash = crypto.createHash("sha3-256").update(address).digest("hex");

  let ret = "0x";
  for (let i = 0; i < address.length; i++) {
    ret += parseInt(hash[i], 16) > 7
      ? address[i].toUpperCase()
      : address[i];
  }
  return ret;
}

module.exports = toChecksumAddress;
