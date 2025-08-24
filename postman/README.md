# Photo Gallery API - Postman Testing Suite

Bộ collection Postman hoàn chỉnh để test API Photo Gallery với các tính năng nâng cao và kiểm tra hiệu suất.

## 📁 Files Included

### 1. `Photo_Gallery_API.postman_collection.json`
**Collection chính** - Kiểm tra toàn bộ chức năng API:
- ✅ **Authentication**: Đăng ký, đăng nhập, làm mới token, đăng xuất
- ✅ **Tag Management**: Tạo, xem, xóa tags (hỗ trợ tiếng Việt)
- ✅ **Album Management**: CRUD operations cho albums
- ✅ **Image Management**: Upload, search, delete với tối ưu hóa
- ✅ **Performance Tests**: Kiểm tra hiệu suất upload và tìm kiếm

### 2. `Photo_Gallery_Environment.postman_environment.json`
**Environment Variables** - Quản lý cấu hình testing:
- 🔧 Base URL và API endpoints
- 🔐 Authentication tokens (access & refresh)
- 👤 User credentials for testing
- 🆔 Dynamic IDs for albums, images, tags

### 3. `Photo_Gallery_Load_Testing.postman_collection.json`
**Load Testing Collection** - Kiểm tra hiệu suất dưới tải:
- 🚀 Concurrent request testing
- 📊 Upload performance benchmarks
- 🔍 Search performance under load
- 📈 Automatic performance reporting

## 🚀 Setup Instructions

### Prerequisites
1. **Postman Desktop App** (recommended) hoặc Postman Web
2. **Server chạy** trên `http://localhost:3002`
3. **Test files** cho upload testing

### Import Collections

1. **Import Main Collection**:
   - Mở Postman → Import
   - Chọn `Photo_Gallery_API.postman_collection.json`

2. **Import Environment**:
   - Mở Postman → Environments → Import
   - Chọn `Photo_Gallery_Environment.postman_environment.json`

3. **Import Load Testing** (optional):
   - Import `Photo_Gallery_Load_Testing.postman_collection.json`

### Set Up Test Files

Tạo các file test trong thư mục project:
```
photo_gallery/
├── test-image.jpg          # File nhỏ (~1-5MB)
├── large-image.jpg         # File lớn (~50-100MB)  
├── very-large-file.jpg     # File rất lớn (>200MB)
├── image1.jpg              # Batch upload test
├── image2.jpg              # Batch upload test
├── image3.jpg              # Batch upload test
└── postman/                # Postman collections
```

## 🎯 Usage Guide

### 1. Basic API Testing

**Bước 1: Authentication**
```
1. Run "Register User" (tạo user mới)
2. Run "Login User" (token sẽ tự động lưu)
3. Các request khác sẽ dùng token này
```

**Bước 2: Create Test Data**
```
1. Run "Create Tag - Vacation"
2. Run "Create Tag - Mùa Hè 2025"  
3. Run "Create Album"
```

**Bước 3: Test Core Features**
```
1. "Upload Single Image" → Test basic upload
2. "Get All Images" → Verify upload successful
3. "Search Images by Tag" → Test search functionality
4. "Add Images to Album" → Test album management
```

### 2. Performance Testing

**Upload Performance**:
```
1. "Upload Single Image" → Baseline performance
2. "Upload Optimized Image" → Large file optimization
3. "Batch Upload Images" → Multiple file handling
```

**Search Performance**:
```
1. "Search Images by Tag" → Tag search speed
2. "Search Images by Album Name" → Album search speed  
3. "Search Mixed Query" → Combined search performance
```

### 3. Load Testing Collection

**Run Performance Benchmarks**:
```
1. "Authentication Load Test" → Login performance
2. "Upload Performance Tests" → File upload benchmarks
3. "Search Performance Tests" → Search speed tests
4. "Generate Performance Summary" → Comprehensive report
```

## 📊 Test Features

### Automated Testing
- ✅ **Status Code Validation** - Tự động kiểm tra response codes
- ✅ **Response Structure** - Validate JSON response format  
- ✅ **Performance Metrics** - Track response times
- ✅ **Token Management** - Auto-save và refresh tokens
- ✅ **Error Handling** - Comprehensive error checking

### Vietnamese Content Support
- 🇻🇳 **Unicode Tags**: "mùa hè 2025", "du lịch", "gia đình"
- 🇻🇳 **Vietnamese Album Names**: "Kỳ Nghỉ Hè 2025"
- 🇻🇳 **Search Testing**: Tìm kiếm với nội dung tiếng Việt

### Performance Monitoring
- ⏱️ **Upload Time Tracking** - Monitor file upload speeds
- 📈 **Compression Ratios** - Track file size optimization
- 🔍 **Search Speed** - Measure query performance
- 📊 **Automatic Reporting** - Generate performance summaries

## 🎛️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API base URL | `http://localhost:3002` |
| `access_token` | JWT access token | Auto-populated from login |
| `refresh_token` | JWT refresh token | Auto-populated from login |
| `test_user_email` | Test user email | `testuser@example.com` |
| `test_album_id` | Album ID for testing | Auto-populated |
| `test_image_id` | Image ID for testing | Auto-populated |

## 🧪 Test Scenarios

### 1. Happy Path Testing
```
Register → Login → Create Tags → Create Album → Upload Images → Search → Delete
```

### 2. Upload Optimization Testing
```
Small File (< 10MB) → Medium File (10-100MB) → Large File (> 100MB)
Compare: Response times, compression ratios, optimization strategies
```

### 3. Search Functionality Testing
```
Tag Search: "vacation", "mùa hè"
Album Search: "Kỳ Nghỉ Hè"  
Mixed Search: "2025" (finds both tags and albums)
```

### 4. Error Handling Testing
```
Invalid tokens → 401 Unauthorized
Missing files → 400 Bad Request  
Duplicate tags → Graceful handling
```

## 📈 Performance Benchmarks

### Expected Performance Targets

| Operation | Target Time | Excellent | Good | Fair |
|-----------|------------|-----------|------|------|
| Login | < 1s | < 500ms | < 1s | < 2s |
| Small Upload | < 5s | < 1s | < 3s | < 5s |
| Large Upload | < 60s | < 10s | < 30s | < 60s |
| Search | < 1s | < 200ms | < 500ms | < 1s |
| Batch Upload | < 30s | < 10s | < 20s | < 30s |

### Performance Optimization Features Tested
- 🗜️ **Auto-compression** - 30-70% file size reduction
- 📦 **Chunked uploads** - Large file handling
- 💾 **Hybrid storage** - Memory vs disk optimization  
- 🔄 **Batch processing** - Multiple file efficiency
- 🚀 **CDN integration** - Cloudinary optimization

## 🐛 Troubleshooting

### Common Issues

**1. Authentication Errors (401)**
```
Solution: Run "Login User" to refresh access token
Check: Token expiration (15 minutes default)
```

**2. File Upload Errors (400)**
```
Check: File exists in project directory
Check: File size < 500MB limit
Check: Correct file paths in form-data
```

**3. Search Returns Empty Results**
```
Check: Images uploaded with correct tags
Check: Albums created with proper names
Check: Search terms match existing content
```

**4. Performance Issues**
```
Check: Server running locally
Check: Large files using "optimized" endpoint
Check: Network connectivity for Cloudinary uploads
```

### Debug Mode

Enable console logging trong Postman:
```javascript
// Add to test scripts for detailed logging
console.log('Request:', pm.request);
console.log('Response:', pm.response.json());
console.log('Performance:', pm.response.responseTime + 'ms');
```

## 🔄 Continuous Testing

### Runner Configuration

**Collection Runner Settings**:
- Iterations: 1-10 (tùy theo test scenario)
- Delay: 100-500ms (tránh overload server)
- Environment: "Photo Gallery Environment"
- Data File: Optional CSV for bulk testing

**Newman CLI** (for CI/CD):
```bash
npm install -g newman
newman run Photo_Gallery_API.postman_collection.json \
  -e Photo_Gallery_Environment.postman_environment.json \
  --reporters html,cli
```

## 📋 Test Checklist

### Before Running Tests:
- [ ] Server running on localhost:3002
- [ ] Database connected (MongoDB)
- [ ] Cloudinary configuration correct
- [ ] Test image files available
- [ ] Postman environment imported

### After Each Test Run:
- [ ] Check all tests passed
- [ ] Review performance metrics
- [ ] Verify upload optimizations working
- [ ] Confirm search results accurate
- [ ] Clean up test data if needed

### Performance Validation:
- [ ] Upload times within targets
- [ ] Search queries < 1 second
- [ ] Compression ratios > 30%
- [ ] No memory leaks during large uploads
- [ ] Error handling working correctly

## 🎉 Advanced Features

### Automated Performance Reporting
Load testing collection tự động tạo báo cáo hiệu suất:
```
=== PHOTO GALLERY API PERFORMANCE REPORT ===
Generated: 2025-08-24T12:00:00.000Z

--- Upload Performance ---
Small File Upload: 1250ms
Medium File Upload: 4800ms  
Large File Upload: 23500ms
Upload Scaling Ratio: 18.8x

--- Search Performance ---
Simple Search: 180ms
Complex Search: 340ms

--- Performance Grades ---
Small Upload Grade: A (Good)
Large Upload Grade: A (Good)
Search Grade: A+ (Excellent)

--- Overall System Health ---
Average Response Time: 6214ms
System Health: A (Good)
```

### Dynamic Test Data
Environment variables tự động cập nhật:
- User IDs từ registration
- Album IDs từ creation
- Image IDs từ uploads
- Tag IDs từ tag creation

Với bộ testing suite này, bạn có thể:
- ✅ **Validate toàn bộ API functionality**
- ✅ **Monitor performance optimizations**
- ✅ **Test Vietnamese content support**  
- ✅ **Generate automated reports**
- ✅ **Run continuous integration tests**
- ✅ **Benchmark upload improvements**

Perfect cho việc đảm bảo chất lượng API và theo dõi hiệu suất của các tính năng tối ưu hóa upload mà chúng ta đã implement!
