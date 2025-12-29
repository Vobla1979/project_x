from fastapi.testclient import TestClient


def create_post(client: TestClient, auth_headers) -> int:
    resp = client.post(
        "/posts/",
        json={"title": "Post for comments", "content": "content"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    return resp.json()["id"]


def test_create_comment(client: TestClient, auth_headers):
    post_id = create_post(client, auth_headers)

    resp = client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Nice post!"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["content"] == "Nice post!"
    assert data["post_id"] == post_id
    assert data["author_id"] > 0


def test_list_comments(client: TestClient, auth_headers):
    post_id = create_post(client, auth_headers)

    for i in range(3):
        client.post(
            f"/posts/{post_id}/comments",
            json={"content": f"Comment {i}"},
            headers=auth_headers,
        )

    resp = client.get(f"/posts/{post_id}/comments")
    assert resp.status_code == 200
    comments = resp.json()
    assert len(comments) >= 3


def test_delete_comment_by_author(client: TestClient, auth_headers):
    post_id = create_post(client, auth_headers)
    resp = client.post(
        f"/posts/{post_id}/comments",
        json={"content": "To be deleted"},
        headers=auth_headers,
    )
    comment_id = resp.json()["id"]

    resp = client.delete(f"/comments/{comment_id}", headers=auth_headers)
    assert resp.status_code == 204

    resp = client.delete(f"/comments/{comment_id}", headers=auth_headers)
    assert resp.status_code == 404
