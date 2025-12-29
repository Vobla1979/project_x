from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login():
    resp = client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "secret123"
    })
    assert resp.status_code == 200

    resp = client.post("/auth/token", data={
        "username": "testuser",
        "password": "secret123"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
