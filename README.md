# Photo Gallery API

Ứng dụng Photo Gallery API được xây dựng bằng Node.js, Express.js và MongoDB, tích hợp với Cloudinary để lưu trữ và quản lý hình ảnh.

## 🔗 Links

- **GitHub Repository**: [https://github.com/thientrile/photo_gallery.git](https://github.com/thientrile/photo_gallery.git)
- **Postman Collection**: [Photo Gallery API Collection](https://www.postman.com/interstellar-resonance-246464/workspace/photo-gallery-api/request/25630734-c886feee-a61b-4a3b-b58f-2c2bd65d4bb6?action=share&source=copy-link&creator=25630734)

## 📋 Mục lục

- [Links](#-links)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Postman Collection](#-postman-collection)
- [Cấu trúc project](#-cấu-trúc-project)
- [Database Schema](#-database-schema)
- [Validation Rules](#-validation-rules)

## 🚀 Tính năng

- **Quản lý tài khoản**: Đăng ký, đăng nhập, đăng xuất, refresh token
- **Quản lý hình ảnh**: Upload, xem, xóa hình ảnh với Cloudinary
- **Quản lý album**: Tạo, chỉnh sửa, xem album hình ảnh
- **Quản lý thẻ (tags)**: Tạo, xóa, xem các thẻ gắn với hình ảnh
- **Xác thực JWT**: Bảo mật API với JSON Web Token
- **Upload multiple files**: Hỗ trợ upload nhiều file cùng lúc
- **Responsive metadata**: Lưu trữ thông tin chi tiết về hình ảnh (kích thước, định dạng, dung lượng)

## 🛠 Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB với Mongoose ODM
- **Cloud Storage**: Cloudinary
- **Authentication**: JSON Web Token (JWT)
- **File Upload**: Multer
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Process Management**: Docker, Docker Compose

## 📋 Yêu cầu hệ thống

- Node.js >= 20.0.0
- MongoDB >= 4.4
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
