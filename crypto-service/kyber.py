from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .encryption import encrypt_password, decrypt_password


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

@app.post("/encrypt")
def encrypt(req: EncryptRequest):
    # 🔐 Currently using classical AES
    encrypted = encrypt_password(req.text, req.password)
    return {"encrypted": encrypted}

@app.post("/decrypt")
def decrypt(req: DecryptRequest):
    try:
        # 🔓 Classical decryption
        decrypted = decrypt_password(req.encrypted, req.password)
        return {"decrypted": decrypted}
    except Exception as e:
        return {"error": str(e)}

# ------------------------
# 🚧 Future Quantum-Safe Endpoint (Kyber)
# ------------------------
# @app.post("/encrypt/kyber")
# def encrypt_kyber(req: EncryptRequest):
#     # 🔒 Planned: Use Kyber KEM to encapsulate a shared key and encrypt vault
#     cipher_data = kyber_encrypt(req.text)
#     return cipher_data

# @app.post("/decrypt/kyber")
# def decrypt_kyber(req: DecryptRequest):
#     try:
#         decrypted = kyber_decrypt(req.encrypted)
#         return {"decrypted": decrypted}
#     except Exception as e:
#         return {"error": str(e)}
