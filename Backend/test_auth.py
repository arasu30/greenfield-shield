import requests

url = "http://localhost:8000/auth/otp-login"
payload = {"phone": "1234567890", "otp": "123456"}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
