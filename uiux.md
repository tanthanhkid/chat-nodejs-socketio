Hướng dẫn UI/UX và CSS Mẫu cho Trang Admin
Phiên bản: 1.0
Ngày tạo: 04/08/2025

1. Nguyên tắc và Mục tiêu Thiết kế
Sạch sẽ & Tập trung (Clean & Focused): Giao diện phải gọn gàng, không có các yếu tố gây xao nhãng. Trọng tâm chính là danh sách người dùng và nội dung cuộc trò chuyện.

Hiệu quả (Efficient): Admin phải có khả năng chuyển đổi giữa các cuộc trò chuyện một cách nhanh chóng và gửi tin nhắn dễ dàng.

Đáp ứng (Responsive): Giao diện phải hoạt động tốt trên mọi kích thước thiết bị, từ điện thoại di động đến máy tính để bàn.

Nhất quán (Consistent): Các yếu tố như nút bấm, màu sắc, và khoảng cách phải đồng nhất trên toàn bộ trang.

2. Bảng màu (Color Palette)
Chúng ta sẽ sử dụng một bảng màu chuyên nghiệp và dịu mắt.

Nền chính (Primary Background): #f4f7fa (Xám rất nhạt)

Nền phụ (Panel Background): #ffffff (Trắng)

Chữ chính (Primary Text): #333333 (Đen đậm)

Chữ phụ (Secondary Text): #777777 (Xám vừa)

Màu nhấn (Accent Color): #007bff (Xanh dương) - Dùng cho các nút, link, và các mục được chọn.

Bong bóng chat Admin (Admin Bubble): #007bff (Nền xanh, chữ trắng)

Bong bóng chat User (User Bubble): #e9e9eb (Nền xám nhạt, chữ đen)

3. Bố cục (Layout) trên các thiết bị
Chúng ta sẽ áp dụng phương pháp "Mobile-First", thiết kế cho màn hình nhỏ trước, sau đó mở rộng cho các màn hình lớn hơn.

3.1. Mobile (< 768px)
Bố cục một cột.

Mặc định, chỉ danh sách người dùng (User List) được hiển thị.

Khi Admin nhấn vào một người dùng, khung chat (Chat Panel) sẽ trượt vào hoặc thay thế hoàn toàn danh sách người dùng.

Sẽ có một nút "Quay lại" (Back) trên khung chat để quay về danh sách người dùng.

3.2. Tablet (≥ 768px)
Bố cục hai cột.

User List ở bên trái với chiều rộng cố định (ví dụ: 280px).

Chat Panel ở bên phải, chiếm phần còn lại của màn hình.

Cả hai cột luôn hiển thị.

3.3. Desktop (≥ 1024px)
Bố cục hai cột tương tự Tablet nhưng rộng rãi hơn.

User List có thể có chiều rộng lớn hơn một chút (ví dụ: 320px).

Chat Panel chiếm phần còn lại.

Tận dụng không gian để hiển thị font chữ và các yếu tố lớn hơn một chút.

4. Mã CSS Mẫu (public/css/admin.css)
Dưới đây là mã CSS hoàn chỉnh cho trang Admin, tuân thủ các nguyên tắc và bố cục đã nêu ở trên.

/* public/css/admin.css */

/* --- Biến và Thiết lập chung --- */
:root {
    --primary-bg: #f4f7fa;
    --panel-bg: #ffffff;
    --primary-text: #333333;
    --secondary-text: #777777;
    --accent-color: #007bff;
    --user-bubble-bg: #e9e9eb;
    --border-color: #dee2e6;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
    margin: 0;
    font-family: var(--font-family);
    background-color: var(--primary-bg);
    color: var(--primary-text);
    overflow: hidden; /* Ngăn cuộn toàn bộ trang */
}

/* --- Bố cục chính --- */
.admin-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden; /* Quan trọng cho bố cục mobile */
}

#user-list-panel {
    background-color: var(--panel-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    /* Mobile-first: chiếm toàn bộ chiều rộng */
    width: 100%;
    flex-shrink: 0;
    transition: margin-left 0.3s ease-in-out;
}

#chat-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-shrink: 0;
    background-color: #f9f9f9;
}

/* Ẩn panel chat trên mobile ban đầu */
.admin-container.show-chat #user-list-panel {
    margin-left: -100%;
}


/* --- Panel Danh sách User --- */
#user-list-panel h2 {
    padding: 20px;
    margin: 0;
    font-size: 1.2rem;
    border-bottom: 1px solid var(--border-color);
}

#user-list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex-grow: 1;
}

#user-list li {
    padding: 15px 20px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s;
}

#user-list li:hover {
    background-color: #f8f9fa;
}

#user-list li.active {
    background-color: var(--accent-color);
    color: white;
    font-weight: bold;
}

/* --- Panel Chat --- */
#chat-panel-header {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--panel-bg);
    border-bottom: 1px solid var(--border-color);
}

#back-to-users-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    margin-right: 15px;
    color: var(--primary-text);
}

#current-chat-user {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

#messages-container {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.message {
    padding: 10px 15px;
    border-radius: 18px;
    margin-bottom: 10px;
    max-width: 70%;
    line-height: 1.4;
}

.user-message {
    background-color: var(--user-bubble-bg);
    color: var(--primary-text);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.admin-message {
    background-color: var(--accent-color);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

.chat-image {
    max-width: 100%;
    border-radius: 15px;
    display: block;
}

.message-input-area {
    display: flex;
    padding: 15px;
    background-color: var(--panel-bg);
    border-top: 1px solid var(--border-color);
}

#admin-message-input {
    flex-grow: 1;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 10px 15px;
    font-size: 1rem;
    outline: none;
}

#admin-message-input:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

#admin-send-btn {
    margin-left: 10px;
    padding: 0 20px;
    border: none;
    background-color: var(--accent-color);
    color: white;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

#admin-send-btn:hover {
    background-color: #0056b3;
}


/* --- Tablet Breakpoint (>= 768px) --- */
@media (min-width: 768px) {
    /* Nút quay lại không cần thiết trên màn hình lớn */
    #back-to-users-btn {
        display: none;
    }

    /* Bố cục 2 cột */
    #user-list-panel {
        width: 280px;
        min-width: 280px; /* Không bị co lại */
    }

    #chat-panel {
        width: auto; /* Tự động chiếm phần còn lại */
        flex-grow: 1;
    }
    
    /* Reset lại hiệu ứng trượt của mobile */
    .admin-container.show-chat #user-list-panel {
        margin-left: 0;
    }
}

/* --- Desktop Breakpoint (>= 1024px) --- */
@media (min-width: 1024px) {
    #user-list-panel {
        width: 320px;
        min-width: 320px;
    }
}
