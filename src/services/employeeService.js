const axios = require('axios');

// Cache dữ liệu nhân viên trong memory
let employeesCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 phút

/**
 * Lấy tất cả nhân viên từ API
 * @param {string|null} departmentId - ID phòng ban (null để lấy tất cả)
 * @returns {Promise<Array>} Danh sách nhân viên
 */
async function getAllEmployees(departmentId = null) {
    try {
        const response = await axios.post('http://103.216.119.80:8080/chat/get-all-employees', {
            departmentId: departmentId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            timeout: 10000 // 10 giây timeout
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        return [];
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error.message);
        return [];
    }
}

/**
 * Lấy danh sách nhân viên với cache
 * @returns {Promise<Array>} Danh sách nhân viên
 */
async function getEmployeesWithCache() {
    const now = Date.now();
    
    // Kiểm tra cache còn hợp lệ không
    if (employeesCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
        return employeesCache;
    }
    
    // Lấy dữ liệu mới từ API
    const employees = await getAllEmployees();
    employeesCache = employees;
    lastFetchTime = now;
    
    return employees;
}

/**
 * Tìm kiếm nhân viên theo tên hoặc username
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Promise<Array>} Kết quả tìm kiếm
 */
async function searchEmployees(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }
    
    const employees = await getEmployeesWithCache();
    const term = searchTerm.toLowerCase().trim();
    
    return employees.filter(employee => {
        const fullName = (employee.fullName || '').toLowerCase();
        const username = (employee.username || '').toLowerCase();
        const employeeCode = (employee.employeeCode || '').toLowerCase();
        
        return fullName.includes(term) || 
               username.includes(term) || 
               employeeCode.includes(term);
    });
}

/**
 * Tìm nhân viên theo username
 * @param {string} username - Username cần tìm
 * @returns {Promise<Object|null>} Thông tin nhân viên
 */
async function getEmployeeByUsername(username) {
    if (!username) return null;
    
    const employees = await getEmployeesWithCache();
    return employees.find(employee => employee.username === username) || null;
}

/**
 * Refresh cache dữ liệu nhân viên
 * @returns {Promise<void>}
 */
async function refreshEmployeesCache() {
    lastFetchTime = 0; // Reset thời gian cache
    await getEmployeesWithCache();
}

module.exports = {
    getAllEmployees,
    getEmployeesWithCache,
    searchEmployees,
    getEmployeeByUsername,
    refreshEmployeesCache
};
