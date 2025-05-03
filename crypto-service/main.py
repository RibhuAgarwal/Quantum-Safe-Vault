from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from encryption import encrypt_password, decrypt_password
from kyber import kyber_encrypt, kyber_decrypt  # Integrated Kyber support

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EncryptRequest(BaseModel):
    text: str
    password: str

class DecryptRequest(BaseModel):
    encrypted: str
    password: str

class KyberEncryptRequest(BaseModel):
    text: str
    public_key: str

class KyberDecryptRequest(BaseModel):
    ciphertext: str
    encapsulated_key: str
    private_key: str

# ----------------------------
# 🔐 Classical AES Endpoints
# ----------------------------
@app.post("/encrypt")
def encrypt(req: EncryptRequest):
    encrypted = encrypt_password(req.text, req.password)
    return {"encrypted": encrypted}

@app.post("/decrypt")
def decrypt(req: DecryptRequest):
    try:
        decrypted = decrypt_password(req.encrypted, req.password)
        return {"decrypted": decrypted}
    except Exception as e:
        return {"error": str(e)}

# ----------------------------
# 🔐 Quantum-Safe Kyber Endpoints
# ----------------------------
@app.post("/encrypt/kyber")
def encrypt_kyber(req: KyberEncryptRequest):
    result = kyber_encrypt(req.text, req.public_key)
    return result

@app.post("/decrypt/kyber")
def decrypt_kyber(req: KyberDecryptRequest):
    try:
        plaintext = kyber_decrypt(req.ciphertext, req.encapsulated_key, req.private_key)
        return {"decrypted": plaintext}
    except Exception as e:
        return {"error": str(e)}
