from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import hashlib
import json

def derive_key(password: str) -> bytes:
    return hashlib.sha256(password.encode()).digest()

def encrypt_password(data: str, password: str) -> str:
    key = derive_key(password)
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode())

    result = {
        'nonce': base64.b64encode(cipher.nonce).decode(),
        'ciphertext': base64.b64encode(ciphertext).decode(),
        'tag': base64.b64encode(tag).decode()
    }

    return base64.b64encode(json.dumps(result).encode()).decode()

def decrypt_password(enc_data: str, password: str) -> str:
    key = derive_key(password)
    raw_json = base64.b64decode(enc_data.encode()).decode()
    raw = json.loads(raw_json)

    nonce = base64.b64decode(raw['nonce'])
    ciphertext = base64.b64decode(raw['ciphertext'])
    tag = base64.b64decode(raw['tag'])

    cipher = AES.new(key, AES.MODE_EAX, nonce)
    return cipher.decrypt_and_verify(ciphertext, tag).decode()
