import time
import requests
import os

LOKI_URL = os.getenv("LOKI_URL", "http://192.168.56.11:3100/loki/api/v1/push")

def send_to_loki(level: str, message: str, service: str = "fastapi"):
    payload = {
        "streams": [
            {"stream": {"service": service, "level": level},
             "values": [[str(int(time.time() * 1e9)), message]]}
        ]
    }
    try:
        requests.post(LOKI_URL, json=payload, timeout=2.0)
    except Exception:
        pass