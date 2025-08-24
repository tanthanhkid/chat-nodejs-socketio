# Timezone Implementation for GMT+7 (Vietnam Time)

## Tổng quan
Dự án chat system đã được cập nhật để hiển thị thời gian theo múi giờ GMT+7 (Vietnam Time) thay vì múi giờ local của server.

## Các thay đổi đã thực hiện

### 1. Tạo file utility mới: `public/js/timezone-utils.js`
- Chứa các hàm utility để chuyển đổi thời gian sang múi giờ GMT+7
- Các hàm chính:
  - `toVietnamTime(timestamp)`: Chuyển đổi timestamp sang Vietnam timezone
  - `formatTimeVietnam(timestamp)`: Format thời gian (HH:MM) theo GMT+7
  - `formatDateVietnam(timestamp)`: Format ngày tháng (DD/MM HH:MM) theo GMT+7
  - `formatFullDateVietnam(timestamp)`: Format đầy đủ (DD/MM/YYYY HH:MM:SS) theo GMT+7

### 2. Cập nhật file layout: `views/layouts/main.hbs`
- Thêm include cho file `timezone-utils.js` trước các file JavaScript khác

### 3. Cập nhật file admin.js: `public/js/admin.js`
- Thay thế hàm `formatTime()` và `formatDate()` để sử dụng `window.TimezoneUtils`
- Sử dụng `formatTimeVietnam()` và `formatDateVietnam()`

### 4. Cập nhật file chat-widget.js: `public/js/chat-widget.js`
- Thay thế hàm `formatTime()` để sử dụng `window.TimezoneUtils.formatTimeVietnam()`

### 5. Cập nhật file broadcast.js: `public/js/broadcast.js`
- Thay thế hàm `formatDate()` để sử dụng `window.TimezoneUtils.formatFullDateVietnam()`

### 6. Cập nhật server.js: `src/server.js`
- Cập nhật helper function `formatDate` trong Handlebars để chuyển đổi sang GMT+7
- Cập nhật route `/example` để include file `timezone-utils.js`

## Cách hoạt động

### Client-side (Browser)
1. File `timezone-utils.js` được load trước các file khác
2. Các hàm format time sử dụng `window.TimezoneUtils` để chuyển đổi thời gian
3. Thời gian được hiển thị theo múi giờ GMT+7 bất kể múi giờ local của user

### Server-side (Node.js)
1. Helper function `formatDate` trong Handlebars được cập nhật
2. Thời gian được chuyển đổi sang GMT+7 trước khi render template
3. Đảm bảo tính nhất quán giữa client và server

## Lợi ích
- Thời gian hiển thị nhất quán theo múi giờ Việt Nam
- Không phụ thuộc vào múi giờ local của server hoặc client
- Dễ dàng maintain và mở rộng
- Tương thích với các timezone khác nhau

## Cách sử dụng
```javascript
// Format thời gian (HH:MM)
const time = window.TimezoneUtils.formatTimeVietnam(timestamp);

// Format ngày tháng (DD/MM HH:MM)
const date = window.TimezoneUtils.formatDateVietnam(timestamp);

// Format đầy đủ (DD/MM/YYYY HH:MM:SS)
const fullDate = window.TimezoneUtils.formatFullDateVietnam(timestamp);
```

## Lưu ý
- Tất cả thời gian được lưu trong database vẫn theo UTC
- Chỉ hiển thị được chuyển đổi sang GMT+7
- Không ảnh hưởng đến logic xử lý thời gian khác trong hệ thống
