// Broadcast functionality
$(document).ready(function() {
    let selectedImageUrl = null;
    let currentPreviewData = null;

    // Initialize
    initializeBroadcast();

    function initializeBroadcast() {
        loadDepartments();
        // BỎ loadBroadcastHistory(); - Không cần nữa
        setupEventListeners();
    }

    function setupEventListeners() {
        // Target type change
        $('#target-type').on('change', function() {
            const targetType = $(this).val();
            if (targetType === 'department') {
                $('#department-select-group').show();
                loadEmployeesForDepartment();
            } else {
                $('#department-select-group').hide();
                loadEmployeesForAll();
            }
        });

        // Department selection
        $('#department-select').on('change', function() {
            const departmentId = $(this).val();
            if (departmentId) {
                loadEmployeesForDepartment(departmentId);
            }
        });

        // Message type change
        $('#message-type').on('change', function() {
            const messageType = $(this).val();
            if (messageType === 'image') {
                $('#text-content-group').hide();
                $('#image-content-group').show();
            } else {
                $('#text-content-group').show();
                $('#image-content-group').hide();
            }
        });

        // Image upload
        $('#image-upload').on('change', handleImageUpload);

        // Send broadcast
        $('#send-broadcast-btn').on('click', sendBroadcast);
        $('#preview-btn').on('click', showPreview);
        $('#confirm-send-btn').on('click', confirmSendBroadcast);
    }

    async function loadDepartments() {
        try {
            const response = await fetch('/api/departments');
            const departments = await response.json();
            
            const select = $('#department-select');
            select.empty().append('<option value="">-- Chọn phòng ban --</option>');
            
            departments.forEach(dept => {
                select.append(`<option value="${dept.departmentId}">${dept.departmentName}</option>`);
            });
            
            $('#total-departments').text(departments.length);
        } catch (error) {
            console.error('Error loading departments:', error);
            showToast('Lỗi', 'Không thể tải danh sách phòng ban', 'error');
        }
    }

    async function loadEmployeesForAll() {
        try {
            const response = await fetch('/api/employees');
            const employees = await response.json();
            $('#total-employees').text(employees.length);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    async function loadEmployeesForDepartment(departmentId) {
        try {
            const response = await fetch(`/api/employees?departmentId=${departmentId}`);
            const employees = await response.json();
            $('#total-employees').text(employees.length);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('Lỗi', 'Kích thước ảnh không được vượt quá 5MB', 'error');
            return;
        }

        try {
            // Compress image
            let fileToUpload = file;
            if (window.imageCompression) {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                fileToUpload = await imageCompression(file, options);
            }

            // Upload
            const formData = new FormData();
            formData.append('image', fileToUpload);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            selectedImageUrl = result.url;

            // Show preview
            $('#image-preview').html(`
                <img src="${result.url}" class="img-thumbnail" style="max-width: 200px;">
                <button type="button" class="btn btn-sm btn-danger mt-1" onclick="removeImage()">
                    <i class="fas fa-times"></i> Xóa
                </button>
            `);
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Lỗi', 'Không thể tải lên hình ảnh', 'error');
        }
    }

    function removeImage() {
        selectedImageUrl = null;
        $('#image-upload').val('');
        $('#image-preview').empty();
    }

    async function showPreview() {
        const formData = getFormData();
        if (!formData) return;

        try {
            // Get employee count
            let employeeCount = 0;
            if (formData.targetType === 'all_employees') {
                const response = await fetch('/api/employees');
                const employees = await response.json();
                employeeCount = employees.length;
            } else {
                const response = await fetch(`/api/employees?departmentId=${formData.targetDepartmentId}`);
                const employees = await response.json();
                employeeCount = employees.length;
            }

            // Show preview
            $('#preview-target').text(formData.targetType === 'all_employees' ? 'Tất cả nhân viên' : 'Phòng ban cụ thể');
            $('#preview-count').text(employeeCount);

            let contentHtml = '';
            if (formData.type === 'image') {
                contentHtml = `<img src="${formData.content}" class="img-fluid" style="max-width: 100%;">`;
            } else {
                contentHtml = `<p>${escapeHtml(formData.content)}</p>`;
            }
            $('#preview-content').html(contentHtml);

            currentPreviewData = { ...formData, employeeCount };
            
            const modal = new bootstrap.Modal('#previewModal');
            modal.show();
        } catch (error) {
            console.error('Error showing preview:', error);
            showToast('Lỗi', 'Không thể hiển thị xem trước', 'error');
        }
    }

    async function sendBroadcast() {
        const formData = getFormData();
        if (!formData) return;

        if (!confirm('Bạn có chắc chắn muốn gửi tin nhắn này?')) return;

        await sendBroadcastMessage(formData);
    }

    async function confirmSendBroadcast() {
        if (!currentPreviewData) return;

        await sendBroadcastMessage(currentPreviewData);
        
        const modal = bootstrap.Modal.getInstance('#previewModal');
        modal.hide();
    }

    async function sendBroadcastMessage(formData) {
        try {
            const response = await fetch('/api/broadcast/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Send failed');

            const result = await response.json();
            
            showToast('Thành công', `Đã gửi tin nhắn tới ${result.sentCount} nhân viên`, 'success');
            
            // Reset form
            resetForm();
            // BỎ loadBroadcastHistory(); - Không cần nữa
        } catch (error) {
            console.error('Error sending broadcast:', error);
            showToast('Lỗi', 'Không thể gửi tin nhắn', 'error');
        }
    }

    function getFormData() {
        const targetType = $('#target-type').val();
        const targetDepartmentId = targetType === 'department' ? $('#department-select').val() : null;
        const messageType = $('#message-type').val();
        
        if (targetType === 'department' && !targetDepartmentId) {
            showToast('Lỗi', 'Vui lòng chọn phòng ban', 'error');
            return null;
        }

        let content = '';
        if (messageType === 'text') {
            content = $('#message-content').val().trim();
            if (!content) {
                showToast('Lỗi', 'Vui lòng nhập nội dung tin nhắn', 'error');
                return null;
            }
        } else {
            content = selectedImageUrl;
            if (!content) {
                showToast('Lỗi', 'Vui lòng chọn hình ảnh', 'error');
                return null;
            }
        }

        return {
            content,
            type: messageType,
            targetType,
            targetDepartmentId
        };
    }

    function resetForm() {
        $('#target-type').val('all_employees').trigger('change');
        $('#message-type').val('text').trigger('change');
        $('#message-content').val('');
        removeImage();
    }

    // BỎ loadBroadcastHistory() function - Không cần nữa

    function formatDate(dateString) {
        return window.TimezoneUtils.formatFullDateVietnam(dateString);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(title, message, type = 'info') {
        // Implement toast notification
        console.log(`${title}: ${message}`);
    }
});

// Global function for image removal
function removeImage() {
    $('#image-upload').val('');
    $('#image-preview').empty();
    selectedImageUrl = null;
}
