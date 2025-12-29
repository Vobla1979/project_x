from fastapi.testclient import TestClient


def test_create_post_authorized(client: TestClient, auth_headers):
    resp = client.post(
        "/posts/",
        json={"title": "My first post", "content": "Hello, world"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "My first post"
    assert "id" in data
    assert data["author_id"] > 0


def test_create_post_unauthorized(client: TestClient):
    resp = client.post(
        "/posts/",
        json={"title": "Guest post", "content": "Should fail"},
    )
    assert resp.status_code == 401


def test_list_posts_with_search(client: TestClient, auth_headers):
    titles = ["FastAPI guide", "React tutorial", "Random post"]
    for title in titles:
        client.post(
            "/posts/",
            json={"title": title, "content": "content"},
            headers=auth_headers,
        )

    resp = client.get("/posts/?search=FastAPI")
    assert resp.status_code == 200
    posts = resp.json()
    assert len(posts) >= 1
    assert any("FastAPI" in p["title"] for p in posts)
