// API Client for COE Portal Backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
    private baseURL: string;
    private token: string | null;

    constructor() {
        this.baseURL = API_URL;
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken() {
        return this.token || localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    }

    // POST request
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    // PUT request
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    // PATCH request
    async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }
}

// Create a singleton instance
const apiClient = new APIClient();

export default apiClient;

// Auth API
export const authAPI = {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
    updatePassword: (passwords) => apiClient.put('/auth/updatepassword', passwords),
};

// Users API
export const usersAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/users${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (userData) => apiClient.post('/users', userData),
    bulkCreate: (usersData) => apiClient.post('/users/bulk', usersData),
    update: (id, userData) => apiClient.put(`/users/${id}`, userData),
    delete: (id) => apiClient.delete(`/users/${id}`),
};

// Exams API
export const examsAPI = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/exams${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiClient.get(`/exams/${id}`),
    create: (examData) => apiClient.post('/exams', examData),
    bulkCreate: (examsData) => apiClient.post('/exams/bulk', examsData),
    update: (id, examData) => apiClient.put(`/exams/${id}`, examData),
    delete: (id) => apiClient.delete(`/exams/${id}`),
};

// Halls API
export const hallsAPI = {
    getAll: () => apiClient.get('/halls'),
    create: (hallData) => apiClient.post('/halls', hallData),
    update: (id, hallData) => apiClient.put(`/halls/${id}`, hallData),
    delete: (id) => apiClient.delete(`/halls/${id}`),
    autoAllocate: (examId) => apiClient.post('/halls/allocate', { examId }),
};

// Marks API
export const marksAPI = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/marks${query ? `?${query}` : ''}`);
    },
    getByStudent: (studentId) => apiClient.get(`/marks/student/${studentId}`),
    create: (marksData) => apiClient.post('/marks', marksData),
    update: (id, marksData) => apiClient.put(`/marks/${id}`, marksData),
    bulkCreate: (marksArray) => apiClient.post('/marks/bulk', marksArray),
};

// Attendance API
export const attendanceAPI = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/attendance${query ? `?${query}` : ''}`);
    },
    getByStudent: (studentId) => apiClient.get(`/attendance/student/${studentId}`),
    mark: (attendanceData) => apiClient.post('/attendance', attendanceData),
    bulkMark: (attendanceArray) => apiClient.post('/attendance/bulk', attendanceArray),
};

// Notifications API
export const notificationsAPI = {
    getAll: () => apiClient.get('/notifications'),
    getById: (id) => apiClient.get(`/notifications/${id}`),
    create: (notificationData) => apiClient.post('/notifications', notificationData),
    markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.patch('/notifications/read-all'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
};

// Circulars API
export const circularsAPI = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/circulars${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiClient.get(`/circulars/${id}`),
    create: (circularData) => apiClient.post('/circulars', circularData),
    update: (id, circularData) => apiClient.put(`/circulars/${id}`, circularData),
    delete: (id) => apiClient.delete(`/circulars/${id}`),
};

// Syllabus API
export const syllabusAPI = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/syllabus${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiClient.get(`/syllabus/${id}`),
    create: (syllabusData) => apiClient.post('/syllabus', syllabusData),
    update: (id, syllabusData) => apiClient.put(`/syllabus/${id}`, syllabusData),
    delete: (id) => apiClient.delete(`/syllabus/${id}`),
};
