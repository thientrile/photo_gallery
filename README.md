# 📸 Photo Gallery API

> Một API hoàn chỉnh cho ứng dụng quản lý thư viện ảnh với các tính năng nâng cao

[![Node.js](https://img.shields.io/badge/Node.js-20.0.0+-green.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-brightgreen.svg)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Integrated-orange.svg)](https://cloudinary.com)
[![JWT](https://img.shields.io/badge/JWT-Authentication-red.svg)](https://jwt.io)

## 🌟 **Tổng Quan**

Photo Gallery API là một backend service mạnh mẽ được xây dựng để quản lý thư viện ảnh trực tuyến. Với kiến trúc RESTful API hiện đại, hệ thống hỗ trợ đầy đủ các tính năng từ quản lý người dùng, upload ảnh, tổ chức album cho đến tìm kiếm thông minh.

### 🎯 **Tính Năng Chính**

#### 👤 **Quản Lý Người Dùng**
- ✅ Đăng ký tài khoản với validation email
- ✅ Đăng nhập/Đăng xuất an toàn 
- ✅ JWT Authentication với Refresh Token
- ✅ Quản lý phiên đăng nhập multiple device

#### 🖼️ **Quản Lý Hình Ảnh**
- ✅ **Upload nhiều ảnh** cùng lúc (bulk upload)
- ✅ **Tích hợp Cloudinary** - CDN global tốc độ cao
- ✅ **Metadata tự động** - kích thước, format, dung lượng
- ✅ **Tìm kiếm thông minh** theo tags và tên album
- ✅ **Xóa an toàn** - xóa cả trên cloud và database

#### 📚 **Quản Lý Album**
- ✅ Tạo/Sửa/Xóa album với validation
- ✅ **Thêm/Xóa ảnh vào album** (single & bulk operations)
- ✅ Ảnh bìa album tự động
- ✅ Quyền riêng tư (public/private)

#### 🏷️ **Hệ Thống Tags**
- ✅ Gắn tags cho ảnh khi upload
- ✅ Tìm kiếm theo tags (case-insensitive)
- ✅ Quản lý tags động

#### � **Tìm Kiếm Nâng Cao**
- ✅ **Tìm kiếm thống nhất** trong một endpoint
- ✅ Tìm theo **tags** và **tên album** cùng lúc
- ✅ Hỗ trợ **tiếng Việt** với diacritics
- ✅ **Partial matching** và **case-insensitive**

## 🚀 **Quick Start**

### 1️⃣ **Clone & Install**
```bash
git clone https://github.com/thientrile/photo_gallery.git
cd photo_gallery
npm install
```

### 2️⃣ **Environment Setup**
```bash
# Copy và cấu hình file môi trường
cp .env.example .env
```

Cập nhật file `.env`:
```env
# Application
APP_NAME=photo_gallery
VERSION=1.0.0
PORT=3002
HOST=localhost
NODE_ENV=development

# Database
LOCAL_DB_CONNECTION=mongodb
LOCAL_DB_HOST=localhost:27017
LOCAL_DB_USER=your_username
LOCAL_DB_PASSWORD=your_password

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3️⃣ **Start Development**
```bash
# Development mode với auto-reload
npm run dev

# Production mode
npm start

# Using Docker
docker-compose up -d
```

### 4️⃣ **Verify Installation**
```bash
curl http://localhost:3002/health
# Expected: {"status": "OK", "timestamp": "..."}
```

## 📋 **API Documentation**

### 🔐 **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/account/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/api/account/login` | Đăng nhập | ❌ |
| `POST` | `/api/account/logout` | Đăng xuất | ✅ |
| `POST` | `/api/account/refresh` | Làm mới token | ✅ |

### 🖼️ **Image Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/gallery/image/` | Lấy tất cả ảnh + tìm kiếm | ✅ |
| `GET` | `/api/gallery/image/:id` | Chi tiết ảnh | ✅ |
| `POST` | `/api/gallery/image/upload` | Upload ảnh (nhiều files) | ✅ |
| `DELETE` | `/api/gallery/image/:id` | Xóa ảnh | ✅ |

#### 🔍 **Tìm Kiếm Ảnh**
```bash
# Lấy tất cả ảnh
GET /api/gallery/image/

# Tìm kiếm thông minh
GET /api/gallery/image/?search=mùa hè 2025
GET /api/gallery/image/?search=vacation
GET /api/gallery/image/?search=biển
```

### 📚 **Album Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/gallery/album/` | Lấy tất cả album | ✅ |
| `GET` | `/api/gallery/album/:id` | Chi tiết album | ✅ |
| `POST` | `/api/gallery/album/` | Tạo album mới | ✅ |
| `PUT` | `/api/gallery/album/:id` | Cập nhật album | ✅ |
| `DELETE` | `/api/gallery/album/:id` | Xóa album | ✅ |

#### 🔄 **Album Operations**
```bash
# Thêm ảnh vào album (đơn lẻ)
POST /api/gallery/image/:imageId/add-to-album
Body: { "albumId": 123456 }

# Thêm nhiều ảnh vào album
POST /api/gallery/image/bulk/add-to-album  
Body: { "imageIds": [123, 456], "albumId": 789 }

# Xóa ảnh khỏi album (đơn lẻ)
DELETE /api/gallery/image/:imageId/remove-from-album

# Xóa nhiều ảnh khỏi album
POST /api/gallery/image/bulk/remove-from-album
Body: { "imageIds": [123, 456] }
```

### 🏷️ **Tag Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/gallery/tag/` | Lấy tất cả tags | ✅ |
| `POST` | `/api/gallery/tag/` | Tạo tag mới | ✅ |
| `DELETE` | `/api/gallery/tag/:id` | Xóa tag | ✅ |

## 💻 **Frontend Integration**

### **JavaScript/React Examples**

#### Upload và Tìm Kiếm
```javascript
// Upload multiple images
const uploadImages = async (files, albumId = null, tags = []) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  formData.append('albumId', albumId);
  formData.append('tags', JSON.stringify(tags));
  formData.append('caption', 'My awesome photos');

  const response = await fetch('/api/gallery/image/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  return await response.json();
};

// Smart search
const searchImages = async (query) => {
  const response = await fetch(`/api/gallery/image/?search=${encodeURIComponent(query)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  return data.metadata.images;
};

// Bulk album operations
const addImagesToAlbum = async (imageIds, albumId) => {
  const response = await fetch('/api/gallery/image/bulk/add-to-album', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageIds, albumId })
  });
  
  return await response.json();
};
```

#### React Hook Example
```jsx
import { useState, useEffect } from 'react';

const usePhotoGallery = (searchQuery = '') => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
        const response = await fetch(`/api/gallery/image/${params}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setImages(data.metadata.images);
      } catch (error) {
        console.error('Fetch images error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery]);

  const addToAlbum = async (imageIds, albumId) => {
    const response = await fetch('/api/gallery/image/bulk/add-to-album', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageIds, albumId })
    });
    return await response.json();
  };

  return { images, loading, albums, addToAlbum };
};
```

## 🏗️ **Kiến Trúc Hệ Thống**

### **Project Structure**
```
photo_gallery/
├── 📁 src/
│   ├── 📁 controller/          # API Controllers
│   │   ├── 📁 Account/         # User authentication
│   │   └── 📁 Gallery/         # Image, Album, Tag controllers
│   ├── 📁 service/            # Business logic
│   ├── 📁 repository/         # Database access layer
│   ├── 📁 model/              # MongoDB schemas
│   ├── 📁 middleware/         # JWT, validation middleware
│   ├── 📁 router/             # Route definitions
│   ├── 📁 dto/                # Data Transfer Objects
│   └── 📁 utils/              # Utilities
│       ├── 📁 cloudinary/     # Cloudinary integration
│       ├── 📁 multer/         # File upload handling
│       ├── 📁 jsonwebtoken/   # JWT utilities
│       └── 📁 validation/     # Joi validation
├── 📄 server.js               # Entry point
├── � config.js               # Configuration
├── 📄 docker-compose.yaml     # Docker setup
└── 📄 package.json
```

### **Database Schema**

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  usr_id: Number,           // Unique user ID
  usr_email: String,        // User email (unique)
  usr_password: String,     // Hashed password
  usr_name: String,         // Display name
  usr_isActive: Boolean,    // Account status
  createdAt: Date,
  updatedAt: Date
}
```

#### **Images Collection**
```javascript
{
  _id: ObjectId,
  img_id: Number,           // Unique image ID
  img_uploaderId: ObjectId, // Reference to User
  img_albumId: ObjectId,    // Reference to Album (nullable)
  img_url: String,          // Cloudinary URL
  img_secureUrl: String,    // HTTPS URL
  img_publicId: String,     // Cloudinary public ID
  img_format: String,       // jpg, png, gif, etc.
  img_width: Number,        // Image width in pixels
  img_height: Number,       // Image height in pixels
  img_bytes: Number,        // File size in bytes
  img_tags: [String],       // Array of tags
  img_caption: String,      // Image description
  img_isPublic: Boolean,    // Public/Private
  createdAt: Date,
  updatedAt: Date
}
```

#### **Albums Collection**
```javascript
{
  _id: ObjectId,
  alb_id: Number,           // Unique album ID
  alb_title: String,        // Album title
  alb_description: String,  // Album description
  alb_userId: ObjectId,     // Reference to User
  alb_cover_image: ObjectId, // Reference to Image (nullable)
  alb_isPublic: Boolean,    // Public/Private
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ **Security Features**

### **Authentication & Authorization**
- ✅ **JWT Access Token** (15 phút expiry)
- ✅ **Refresh Token** (7 ngày expiry) 
- ✅ **Blacklist Token** khi logout
- ✅ **Multiple Device Support**
- ✅ **Rate Limiting** cho sensitive endpoints

### **Data Validation**
- ✅ **Joi Schema Validation** cho tất cả inputs
- ✅ **File Type Validation** (chỉ image files)
- ✅ **File Size Limits** (configurable)
- ✅ **Sanitization** để prevent injection

### **Error Handling**
- ✅ **Centralized Error Handler**
- ✅ **Meaningful Error Messages** (tiếng Việt)
- ✅ **Error Logging** với stack trace
- ✅ **API Response Consistency**

## 🚀 **Deployment**

### **Using Docker**
```bash
# Build và start services
docker-compose up -d

# Logs
docker-compose logs -f app

# Stop services  
docker-compose down
```

### **Environment Variables**
```env
# Production Configuration
NODE_ENV=production
PORT=3002

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/photo_gallery

# Cloudinary (Production)
CLOUDINARY_NAME=your-production-cloud
CLOUDINARY_API_KEY=your-production-key
CLOUDINARY_API_SECRET=your-production-secret

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### **Performance Optimization**
- ✅ **MongoDB Indexing** cho search queries
- ✅ **Cloudinary Transformations** cho responsive images
- ✅ **Compression** middleware
- ✅ **CORS** configuration
- ✅ **Memory Usage** optimization

## 📊 **API Testing**

### **Postman Collection**
Import collection: [Photo Gallery API Collection](https://www.postman.com/interstellar-resonance-246464/workspace/photo-gallery-api/request/25630734-c886feee-a61b-4a3b-b58f-2c2bd65d4bb6?action=share&source=copy-link&creator=25630734)

### **Manual Testing với cURL**

```bash
# 1. Register new user
curl -X POST http://localhost:3002/api/account/register \
  -H "Content-Type: application/json" \
  -d '{"usr_email":"test@example.com","usr_password":"123456","usr_name":"Test User"}'

# 2. Login
curl -X POST http://localhost:3002/api/account/login \
  -H "Content-Type: application/json" \
  -d '{"usr_email":"test@example.com","usr_password":"123456"}'

# 3. Upload images (replace YOUR_TOKEN)
curl -X POST http://localhost:3002/api/gallery/image/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "tags=[\"vacation\",\"beach\"]" \
  -F "caption=Summer vacation photos"

# 4. Search images
curl -X GET "http://localhost:3002/api/gallery/image/?search=vacation" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Create album
curl -X POST http://localhost:3002/api/gallery/album/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alb_title":"Summer 2025","alb_description":"Best summer memories"}'

# 6. Add images to album
curl -X POST http://localhost:3002/api/gallery/image/bulk/add-to-album \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"imageIds":[123,456],"albumId":789}'
```

## 🤝 **Contributing**

### **Development Setup**
```bash
# Fork repository và clone
git clone https://github.com/YOUR_USERNAME/photo_gallery.git
cd photo_gallery

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (nếu có)
npm test
```

### **Code Standards**
- ✅ ESLint configuration
- ✅ Consistent naming conventions
- ✅ Comprehensive error handling
- ✅ Vietnamese comments cho business logic

## 📄 **License**

MIT License - xem [LICENSE](LICENSE) file để biết thêm chi tiết.

## 🙋 **Support**

### **Documentation**
- 📖 [Search API Guide](SEARCH_API_GUIDE.md)
- 📖 [Album Management API](ALBUM_MANAGEMENT_API.md)
- 📖 [Postman Collection](https://www.postman.com/interstellar-resonance-246464/workspace/photo-gallery-api/)

### **Contact**
- � Email: thientrile@example.com
- 🐙 GitHub: [@thientrile](https://github.com/thientrile)
- 💼 LinkedIn: [Trí Lê](https://linkedin.com/in/thientrile)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/thientrile">Trí Lê</a></p>
  <p>⭐ Star this repo if you like it!</p>
</div>
- Docker & Docker Compose (tùy chọn)
- Tài khoản Cloudinary

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/thientrile/photo_gallery.git
cd photo_gallery
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Sao chép file `.env.example` thành `.env`:

```bash
copy .env.example .env
```

## ⚙️ Cấu hình

### Cấu hình file .env

```env
APPP_NAME=photo_gallery
VERSION=1.0.0
DESCRIPTION=Photo Gallery Application
PORT=3002
HOST=localhost

# Database Configuration
LOCAL_DB_CONNECTION=mongodb
LOCAL_DB_USER=root
LOCAL_DB_PASSWORD=123456
LOCAL_DB_HOST=localhost:27017

NODE_ENV=local

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Cấu hình Cloudinary

1. Đăng ký tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy thông tin `Cloud Name`, `API Key`, `API Secret`
3. Cập nhật vào file `.env`

## 🚀 Chạy ứng dụng

### Chạy với Docker (Khuyến nghị)

```bash
# Khởi động MongoDB
docker-compose up -d

# Chạy ứng dụng
npm run dev
```

### Chạy thủ công

```bash
# Khởi động MongoDB (cần cài đặt MongoDB local)
mongod

# Chạy ứng dụng ở chế độ development
npm run dev

# Hoặc chạy ở chế độ production
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3002`

## 📚 API Documentation

### Base URL
```
http://localhost:3002/api
```

### Response Format
Tất cả API responses đều có format thống nhất:

**Success Response:**
```json
{
  "status": "success",
  "message": "Mô tả thành công",
  "metadata": { /* dữ liệu trả về */ }
}
```

**Error Response:**
```json
{
  "status": "Error",
  "code": 400,
  "message": "Mô tả lỗi"
}
```

### HTTP Status Codes
- `200`: OK - Request thành công
- `201`: Created - Tạo mới thành công  
- `400`: Bad Request - Dữ liệu đầu vào không hợp lệ
- `401`: Unauthorized - Chưa xác thực
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy resource
- `500`: Internal Server Error - Lỗi server

### Authentication
API sử dụng 2 loại token:
- **Access Token**: Gửi qua header `Authorization: Bearer <access-token>`
- **Refresh Token**: Gửi qua header `x-rtoken-id: <refresh-token>`

### Account Management

#### 1. Đăng ký tài khoản
```http
POST /api/account/register
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Register Account",
  "metadata": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "slug": "uid123456"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### 2. Đăng nhập
```http
POST /api/account/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login Account",
  "metadata": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "slug": "uid123456"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### 3. Refresh Token
```http
PATCH /api/account/refresh-token
x-rtoken-id: <your-refresh-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Refresh Token",
  "metadata": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### 4. Đăng xuất
```http
DELETE /api/account/logout
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Logout Account",
  "metadata": true
}
```

### Image Management

#### 1. Upload hình ảnh
```http
POST /api/images/upload
Authorization: Bearer <your-access-token>
Content-Type: multipart/form-data

Form Data:
- files: [file1, file2, ...] (tối đa 100 files)
- albumId: 123456 (tùy chọn - ID số của album)
- caption: "Mô tả hình ảnh" (tùy chọn)
- tags: ["tag1", "tag2"] (tùy chọn)
```

**Response:**
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "metadata": [
    {
      "id": 123456,
      "secureUrl": "https://res.cloudinary.com/...",
      "format": "jpg",
      "width": 1920,
      "height": 1080,
      "bytes": 245760,
      "tags": ["vacation", "beach"],
      "caption": "Beautiful sunset",
      "createdAt": "2025-08-03T10:30:00.000Z"
    }
  ]
}
```

#### 2. Lấy thông tin hình ảnh
```http
GET /api/images/:imageId
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Image retrieved successfully",
  "metadata": {
    "id": 123456,
    "secureUrl": "https://res.cloudinary.com/...",
    "format": "jpg",
    "width": 1920,
    "height": 1080,
    "bytes": 245760,
    "tags": ["vacation", "beach"],
    "caption": "Beautiful sunset",
    "isPublic": false,
    "createdAt": "2025-08-03T10:30:00.000Z"
  }
}
```

#### 3. Lấy tất cả hình ảnh của user
```http
GET /api/images
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "All images retrieved successfully",
  "metadata": [
    {
      "id": 123456,
      "secureUrl": "https://res.cloudinary.com/...",
      "format": "jpg",
      "width": 1920,
      "height": 1080,
      "caption": "Beautiful sunset",
      "createdAt": "2025-08-03T10:30:00.000Z"
    }
  ]
}
```

#### 4. Lấy hình ảnh theo album
```http
GET /api/images/album/:albumId
Authorization: Bearer <your-access-token>
```

#### 5. Xóa hình ảnh
```http
DELETE /api/images/:imageId
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Image deleted successfully",
  "metadata": {
    "deleted": true,
    "imageId": "507f1f77bcf86cd799439011"
  }
}
```

### Album Management

#### 1. Tạo album mới
```http
POST /api/albums
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "title": "Kỳ nghỉ hè 2025",
  "description": "Những kỷ niệm đẹp từ kỳ nghỉ hè",
  "cover_image": 123456
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Album created successfully",
  "metadata": {
    "id": 789012,
    "title": "Kỳ nghỉ hè 2025",
    "description": "Những kỷ niệm đẹp từ kỳ nghỉ hè",
    "cover_image": "507f1f77bcf86cd799439011",
    "isPublic": false
  }
}
```

#### 2. Lấy tất cả album của user
```http
GET /api/albums
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Albums retrieved successfully",
  "metadata": [
    {
      "id": 789012,
      "title": "Kỳ nghỉ hè 2025",
      "description": "Những kỷ niệm đẹp từ kỳ nghỉ hè",
      "cover_image": "507f1f77bcf86cd799439011",
      "isPublic": false
    }
  ]
}
```

#### 3. Chỉnh sửa album
```http
PATCH /api/albums/:albumId
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "title": "Kỳ nghỉ hè 2025 - Đã cập nhật",
  "description": "Mô tả đã được cập nhật",
  "cover_image": 654321
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Album updated successfully",
  "metadata": {
    "id": 789012,
    "title": "Kỳ nghỉ hè 2025 - Đã cập nhật",
    "description": "Mô tả đã được cập nhật",
    "cover_image": "507f1f77bcf86cd799439012",
    "isPublic": false
  }
}
```

### Tag Management

#### 1. Tạo tag mới
```http
POST /api/tags
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "name": "vacation"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Tag created successfully",
  "metadata": {
    "id": 123456,
    "name": "vacation"
  }
}
```

#### 2. Lấy tất cả tags của user
```http
GET /api/tags
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Tags retrieved successfully",
  "metadata": [
    {
      "id": 123456,
      "name": "vacation"
    },
    {
      "id": 123457,
      "name": "family"
    },
    {
      "id": 123458,
      "name": "nature"
    }
  ]
}
```

#### 3. Xóa tag
```http
DELETE /api/tags/:tagId
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Tag deleted successfully",
  "metadata": true
}
```

## � Postman Collection

Để dễ dàng test và sử dụng API, bạn có thể import Postman Collection:

**🔗 Link Collection**: [Photo Gallery API Collection](https://www.postman.com/interstellar-resonance-246464/workspace/photo-gallery-api/request/25630734-c886feee-a61b-4a3b-b58f-2c2bd65d4bb6?action=share&source=copy-link&creator=25630734)

### Cách sử dụng Postman Collection:

1. **Import Collection**:
   - Mở Postman
   - Click "Import" 
   - Paste link collection ở trên
   - Click "Continue" và "Import"

2. **Setup Environment**:
   - Tạo environment mới trong Postman
   - Thêm các variables:
     ```
     baseUrl: http://localhost:3002/api
     accessToken: (sẽ được set tự động sau khi login)
     refreshToken: (sẽ được set tự động sau khi login)
     ```

3. **Authentication Flow**:
   - Chạy **Register** hoặc **Login** request trước
   - Tokens sẽ được lưu tự động vào environment variables
   - Các request khác sẽ tự động sử dụng tokens này

4. **Test Scenarios**:
   - **Account**: Register → Login → Refresh Token → Logout
   - **Images**: Login → Upload Images → Get Images → Delete Image
   - **Albums**: Login → Create Album → Get Albums → Edit Album
   - **Tags**: Login → Create Tag → Get Tags → Delete Tag

## �📁 Cấu trúc project

```
photo_gallery/
├── src/
│   ├── controller/           # Controllers xử lý request/response
│   │   ├── Account/         # Account controller
│   │   └── Gallery/         # Gallery controllers
│   ├── model/               # MongoDB models
│   │   ├── user.model.js
│   │   ├── image.model.js
│   │   ├── album.model.js
│   │   ├── tag.model.js
│   │   └── keytoken.model.js
│   ├── service/             # Business logic
│   ├── repository/          # Database operations
│   ├── router/              # Route definitions
│   │   ├── account/
│   │   └── gallery/
│   ├── middleware/          # Custom middleware
│   ├── dto/                 # Data Transfer Objects
│   ├── utils/               # Utility functions
│   │   ├── cloudinary/      # Cloudinary integration
│   │   ├── mongo/           # MongoDB connection
│   │   ├── multer/          # File upload handling
│   │   ├── validate/        # Input validation
│   │   └── handRespones/    # Response handling
│   └── app.js               # Express app configuration
├── config.js                # Application configuration
├── server.js                # Entry point
├── package.json
├── docker-compose.yaml      # Docker compose configuration
├── .env.example             # Environment variables template
└── README.md
```

## 💾 Database Schema

### User Schema
```javascript
{
  usr_id: Number,
  usr_slug: String,
  usr_email: String,
  usr_phone: String,
  usr_name: String,
  usr_salt: String,
  usr_sex: String,
  usr_avatar: String,
  usr_date_of_birth: Date,
  usr_status: String // 'pending', 'active', 'block'
}
```

### Image Schema
```javascript
{
  img_uploaderId: ObjectId, // ref: User
  img_albumId: ObjectId,    // ref: Album
  img_id: Number,
  img_url: String,
  img_secureUrl: String,
  img_publicId: String,     // Cloudinary public ID
  img_format: String,       // png, jpg, webp, etc.
  img_width: Number,
  img_height: Number,
  img_bytes: Number,
  img_tags: [String],
  img_caption: String,
  img_isPublic: Boolean
}
```

### Album Schema
```javascript
{
  alb_id: Number,
  alb_title: String,
  alb_description: String,
  alb_cover_image: ObjectId, // ref: Image
  alb_userId: ObjectId,      // ref: User
  alb_isPublic: Boolean
}
```

### Tag Schema
```javascript
{
  tag_id: Number,
  tag_name: String,
  tag_createdBy: ObjectId    // ref: User
}
```

## � Validation Rules

### Account Registration
- `name`: Bắt buộc, từ 3-30 ký tự
- `email`: Bắt buộc, format email hợp lệ, unique
- `password`: Bắt buộc, tối thiểu 6 ký tự

### Account Login  
- `username`: Bắt buộc, format email hợp lệ
- `password`: Bắt buộc, tối thiểu 6 ký tự

### Album Creation
- `title`: Bắt buộc, từ 2-100 ký tự
- `description`: Tùy chọn, tối đa 500 ký tự
- `cover_image`: Tùy chọn, ID số của hình ảnh

### Image Upload
- `files`: Bắt buộc, tối đa 100 files
- `albumId`: Tùy chọn, ID số của album
- `caption`: Tùy chọn, tối đa 500 ký tự
- `tags`: Tùy chọn, mảng string

### Tag Creation
- `name`: Bắt buộc, unique cho mỗi user

## �🛡️ Security

- **JWT Authentication**: Tất cả API đều được bảo vệ bằng JWT
- **Input Validation**: Sử dụng Joi để validate input
- **CORS**: Cấu hình CORS để bảo mật cross-origin requests
- **Helmet**: Bảo mật HTTP headers
- **Password Hashing**: Mật khẩu được hash trước khi lưu

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Production database
PRODUCTION_DB_CONNECTION=mongodb
PRODUCTION_DB_HOST=your-mongodb-uri
PRODUCTION_DB_USER=your-db-user
PRODUCTION_DB_PASSWORD=your-db-password

# JWT Secret (nên sử dụng secret key mạnh)
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary production credentials
CLOUDINARY_NAME=your-production-cloudinary-name
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret
```

## 📝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu có bất kỳ vấn đề gì, vui lòng tạo issue trên GitHub repository.

## 📄 License

This project is licensed under the ISC License.
