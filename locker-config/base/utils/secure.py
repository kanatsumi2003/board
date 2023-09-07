import hmac
import hashlib
import json

def hash_message(message: str, secret_key:str) -> str:
    secure_message = f"message:{message}|secret_key:{secret_key}"
    return hmac.new(secret_key.encode('utf-8'), secure_message.encode('utf-8'), hashlib.sha256).hexdigest()


def verify(message: str, hashed_message:str, secret_key:str) -> bool:
    secure_message = f"message:{message}|secret_key:{secret_key}"
    hmac_digest = hmac.new(secret_key.encode('utf-8'), secure_message.encode('utf-8'), hashlib.sha256).hexdigest()
    return hmac.compare_digest(hashed_message, hmac_digest)
    