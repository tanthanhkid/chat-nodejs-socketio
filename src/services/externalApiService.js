// Service để gọi API external
const axios = require('axios');

const EXTERNAL_API_BASE = 'http://103.216.119.80:8080/chat';

class ExternalApiService {
    static async getAllDepartments() {
        try {
            const response = await axios.post(`${EXTERNAL_API_BASE}/get-all-departments`, '', {
                headers: { 'accept': '*/*' }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    static async getAllEmployees(departmentId = null) {
        try {
            const response = await axios.post(`${EXTERNAL_API_BASE}/get-all-employees`, {
                departmentId: departmentId
            }, {
                headers: { 
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }
}

module.exports = ExternalApiService;
