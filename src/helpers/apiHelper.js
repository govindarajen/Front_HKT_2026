import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }
});

apiClient.interceptors.request.use(
    config => {
        // Add token to headers if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => {
        if(response?.data?.token) {
            // Save token to localStorage if present in response
            localStorage.setItem('token', response.data.token);
            // Update the Authorization header for future requests
            apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            const token = localStorage.getItem('token');
            if (token) {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
)

export { apiClient };