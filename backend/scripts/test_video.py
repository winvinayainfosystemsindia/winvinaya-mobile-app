import httpx
import uuid
from typing import Optional

def run_test():
    with httpx.Client(base_url="http://127.0.0.1:8000") as client:
        # First login to get token
        resp = client.post("/api/v1/auth/login", data={"username": "superadmin@example.com", "password": "password123"})
        if resp.status_code != 200:
            print("Login failed:", resp.status_code)
            return
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get course 10
        resp = client.get("/api/v1/courses/10", headers=headers)
        if resp.status_code != 200:
            print("Course 10 fetch failed:", resp.status_code)
            return
        course = resp.json()
        print(f"Course: {course['title']}")
        
        # Find a video lesson
        video_lesson = None
        for mod in course.get('modules', []):
            for lesson in mod.get('lessons', []):
                if lesson.get('content_type') == 'video':
                    video_lesson = lesson
                    break
            if video_lesson:
                break
                
        if not video_lesson:
            print("No video lesson found in course 10.")
            return
            
        print(f"Testing video lesson: {video_lesson['title']}, media_id: {video_lesson.get('media_file_id')}")
        
        if not video_lesson.get('media_file_id'):
            print("Video lesson exists but HAS NO media_file_id!!")
            return
            
        # Hit share-url
        resp = client.get(f"/api/v1/media/{video_lesson['media_file_id']}/share-url", headers=headers)
        print("Share URL resp status:", resp.status_code)
        if resp.status_code != 200:
            print("Share URL error:", resp.text)
            return
            
        data = resp.json()
        print("Share URL data:", data)
        
        # Test stream url
        if data.get('stream_url'):
            stream = client.get(data['stream_url'], headers={"Range": "bytes=0-100"})
            print(f"Raw MP4 Stream Status: {stream.status_code}, content type: {stream.headers.get('content-type')}")
        
        # Test HLS url
        if data.get('hls_url'):
            hls = client.get(data['hls_url'])
            print(f"HLS Master Manifest Status: {hls.status_code}, length: {len(hls.text)}")

if __name__ == "__main__":
    run_test()
