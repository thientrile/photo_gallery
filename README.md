# Photo Gallery API

Ứng dụng Photo Gallery API được xây dựng bằng Node.js, Express.js và MongoDB, tích hợp với Cloudinary để lưu trữ và quản lý hình ảnh.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Cấu trúc project](#-cấu-trúc-project)
- [Database Schema](#-database-schema)

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
git clone <repository-url>
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

### Authentication
Hầu hết các API đều yêu cầu token xác thực. Token được gửi qua header:
```
Authorization: Bearer <your-jwt-token>
```

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
    "user": {...},
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
Authorization: Bearer <your-jwt-token>
```

#### 4. Đăng xuất
```http
DELETE /api/account/logout
Authorization: Bearer <your-jwt-token>
```

### Image Management

#### 1. Upload hình ảnh
```http
POST /api/images/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

files: [file1, file2, ...] (tối đa 100 files)
albumId: "album_object_id" (tùy chọn)
caption: "Mô tả hình ảnh" (tùy chọn)
tags: ["tag1", "tag2"] (tùy chọn)
isPublic: true/false (tùy chọn)
```

#### 2. Lấy thông tin hình ảnh
```http
GET /api/images/:imageId
Authorization: Bearer <your-jwt-token>
```

#### 3. Lấy tất cả hình ảnh của user
```http
GET /api/images
Authorization: Bearer <your-jwt-token>
```

#### 4. Lấy hình ảnh theo album
```http
GET /api/images/album/:albumId
Authorization: Bearer <your-jwt-token>
```

#### 5. Xóa hình ảnh
```http
DELETE /api/images/:imageId
Authorization: Bearer <your-jwt-token>
```

### Album Management

#### 1. Tạo album mới
```http
POST /api/albums
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Tên album",
  "description": "Mô tả album",
  "isPublic": false
}
```

#### 2. Lấy tất cả album của user
```http
GET /api/albums
Authorization: Bearer <your-jwt-token>
```

#### 3. Chỉnh sửa album
```http
PATCH /api/albums/:albumId
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Tên album mới",
  "description": "Mô tả mới",
  "isPublic": true
}
```

### Tag Management

#### 1. Tạo tag mới
```http
POST /api/tags
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "tên-tag"
}
```

#### 2. Lấy tất cả tags
```http
GET /api/tags
Authorization: Bearer <your-jwt-token>
```

#### 3. Xóa tag
```http
DELETE /api/tags/:tagId
Authorization: Bearer <your-jwt-token>
```

## 📁 Cấu trúc project

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

## 🛡️ Security

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
