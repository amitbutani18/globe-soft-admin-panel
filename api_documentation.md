# Aesthetic AI - Backend API Documentation

This document provides details for all available API endpoints, including `curl` examples and expected response formats.

- **Base URL**: `http://localhost:8080/api`
- **Port**: `8080`

---

## 1. Categories
Manages the main categories displayed on the home page.

### GET /api/Categorys
Fetch all categories with pagination and optional filtering.

**Query Parameters:**
- `is_active` (bool, optional): Filter by active status (e.g., `?is_active=true`)
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Items per page (default: 10)

**Sample Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60d5f...",
      "name": "Cinematic Portraits",
      "beforeImage": "https://...",
      "afterImage": "https://...",
      "is_active": true,
      "seq_num": 1
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### POST /api/Categorys
Create a new category.

```bash
curl -i -X POST http://localhost:8080/api/Categorys \
-H "Content-Type: application/json" \
-d '{
  "name": "Cinematic Portraits",
  "beforeImage": "https://example.com/before.jpg",
  "afterImage": "https://example.com/after.jpg",
  "is_active": true,
  "seq_num": 1
}'
```

---

## 2. Sub-Categories
Manages sub-categories linked to a main category.

### GET /api/sub-Categorys
Fetch all sub-categories.

**Query Parameters:**
- `CategoryId` (string, optional): Filter by Parent Category ID.
- `is_premium` (bool, optional): If `false` (default), the `prompt` field will be appended with a random user prompt for non-premium testing.
- `is_active` (bool, optional): Filter by active status.

```bash
curl -i "http://localhost:8080/api/sub-Categorys?CategoryId=60d5f...&is_premium=false"
```

### POST /api/sub-Categorys
Create a new sub-category.

```bash
curl -i -X POST http://localhost:8080/api/sub-Categorys \
-H "Content-Type: application/json" \
-d '{
  "CategoryId": "60d5f...",
  "name": "Neon Dreams",
  "refImage": "https://example.com/ref.jpg",
  "prompt": "Highly detailed neon portrait...",
  "is_active": true,
  "seq_num": 1
}'
```

---

## 3. Global Configurations
Settings for AI (Gemini), Ads, and App Limits.

### AI Configuration
- **GET** `/api/ai-config`: Fetch current Gemini API settings.
- **PUT** `/api/ai-config`: Update settings.

### Ad Configuration
- **GET** `/api/ad_config`: Fetch ad visibility and frequency settings.
- **PUT** `/api/ad_config`: Update settings (Banner, Interstitial, Rewarded).

### Ads Units
- **GET** `/api/ads`: Fetch AdMob IDs for iOS/Android.
- **PUT** `/api/ads`: Update IDs.

### Image Generation Limits
- **GET** `/api/image_generation_limit`: Fetch daily limits for Free/Premium users.

---

## 4. User Prompts
Base prompts used to "mix" with sub-category prompts for non-premium users.

### GET /api/user-prompts
```bash
curl -i "http://localhost:8080/api/user-prompts"
```

### POST /api/user-prompts
```bash
curl -i -X POST http://localhost:8080/api/user-prompts \
-H "Content-Type: application/json" \
-d '{
  "promts": "masterpiece, 8k resolution, cinematic lighting"
}'
```

---

## 5. File Upload (DigitalOcean Spaces)
Generate a presigned URL to upload images directly from the frontend to DO Spaces.

### POST /api/upload/presigned-url
**Body Parameters:**
- `fileName`: The name of the file (e.g., `test.jpg`).
- `fileType`: MIME type (e.g., `image/jpeg`).
- `folderName` (optional): Destination folder (default: `general`).

```bash
curl -i -X POST http://localhost:8080/api/upload/presigned-url \
-H "Content-Type: application/json" \
-d '{
  "fileName": "my-photo.jpg",
  "fileType": "image/jpeg",
  "folderName": "categories"
}'
```

**Response:**
```json
{
  "success": true,
  "presignedUrl": "https://...",
  "objectUrl": "https://..."
}
```

---

## Response Status Codes
- `200 OK`: Success.
- `201 Created`: Successfully created a resource.
- `400 Bad Request`: Validation error or invalid JSON.
- `404 Not Found`: Resource or ID does not exist.
- `500 Internal Server Error`: Server or Database issue.
