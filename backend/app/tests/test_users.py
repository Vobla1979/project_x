from fastapi.testclient import TestClient


def test_get_me(client: TestClient, auth_headers):
    resp = client.get("/users/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert "email" in data


def test_update_me(client: TestClient, auth_headers):
    new_username = "updated_name"
    resp = client.patch(
        "/users/me",
        json={"username": new_username},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == new_username


def test_list_users_with_search(client: TestClient, test_user, admin_user, auth_headers):
    resp = client.get("/users?search=test", headers=auth_headers)
    assert resp.status_code == 200
    users = resp.json()
    assert any("test" in u["username"] for u in users)


def test_delete_user_as_admin(client: TestClient, admin_headers, test_user):
    resp = client.delete(f"/users/{test_user.id}", headers=admin_headers)
    assert resp.status_code == 204

    resp = client.delete(f"/users/{test_user.id}", headers=admin_headers)
    assert resp.status_code == 404
