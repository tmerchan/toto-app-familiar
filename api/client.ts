import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
    LoginResponse,
    UserDTO,
    ContactDTO,
    ReminderDTO,
    HistoryEventDTO,
    ErrorResponse,
    ApiError,
} from './types';

// API base URL - replace with your backend URL
// For development: 
// - Physical device: use your computer's IP (e.g., http://192.168.1.100:8080/api)
// - Android Emulator: http://10.0.2.2:8080/api
// - iOS Simulator: http://localhost:8080/api
// Production: https://toto-backend-production.up.railway.app/api
const API_BASE_URL = 'https://toto-backend-production.up.railway.app/api';

const STORAGE_KEYS = {
    ACCESS_TOKEN: '@toto/access_token',
    REFRESH_TOKEN: '@toto/refresh_token',
    USER: '@toto/user',
};

class ApiClient {
    private client: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (token: string) => void;
        reject: (error: any) => void;
    }> = [];

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError<ErrorResponse>) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                // If error is 401 and we haven't retried yet
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // If already refreshing, queue this request
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                return this.client(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }

                        const response = await this.refreshToken({ refreshToken });
                        const { accessToken } = response;

                        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

                        // Retry all queued requests
                        this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
                        this.failedQueue = [];

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        }
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.failedQueue.forEach(({ reject }) => reject(refreshError));
                        this.failedQueue = [];

                        // Clear tokens and redirect to login
                        await this.clearAuth();
                        throw refreshError;
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError<ErrorResponse>): ApiError {
        if (error.response) {
            const { data } = error.response;
            return {
                message: data.message || 'Ocurrió un error en el servidor',
                status: data.status,
                fieldErrors: data.fieldErrors,
            };
        } else if (error.request) {
            return {
                message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            };
        } else {
            return {
                message: error.message || 'Ocurrió un error inesperado',
            };
        }
    }

    private async clearAuth() {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER,
        ]);
    }

    // Auth endpoints
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/auth/login', data);
        return response.data;
    }

    async register(data: RegisterRequest): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/auth/register', data);
        return response.data;
    }

    async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/auth/refresh', data);
        return response.data;
    }

    async getCurrentUser(): Promise<UserDTO> {
        const response = await this.client.get<UserDTO>('/auth/me');
        return response.data;
    }
    
    // User endpoints
    async getElderlyUnderCare(): Promise<UserDTO[]> {
        const response = await this.client.get<UserDTO[]>('/user/elderly-under-care');
        return response.data;
    }

    async updateUser(userId: number, data: Partial<UserDTO>): Promise<UserDTO> {
        const response = await this.client.put<UserDTO>(`/user/${userId}`, data);
        return response.data;
    }

    // Contact endpoints
    async getContactsByElderlyId(elderlyId: number): Promise<ContactDTO[]> {
        const response = await this.client.get<ContactDTO[]>('/contacts', {
            params: { elderlyId },
        });
        return response.data;
    }

    async getContactById(id: number): Promise<ContactDTO> {
        const response = await this.client.get<ContactDTO>(`/contacts/${id}`);
        return response.data;
    }

    async createContact(data: ContactDTO): Promise<ContactDTO> {
        const response = await this.client.post<ContactDTO>('/contacts', data);
        return response.data;
    }

    async updateContact(id: number, data: ContactDTO): Promise<ContactDTO> {
        const response = await this.client.put<ContactDTO>(`/contacts/${id}`, data);
        return response.data;
    }

    async deleteContact(id: number): Promise<void> {
        await this.client.delete(`/contacts/${id}`);
    }

    // Reminder endpoints
    async getRemindersByElderlyId(elderlyId: number, activeOnly = false): Promise<ReminderDTO[]> {
        const response = await this.client.get<ReminderDTO[]>('/reminders', {
            params: { elderlyId, activeOnly },
        });
        return response.data;
    }

    async getReminderById(id: number): Promise<ReminderDTO> {
        const response = await this.client.get<ReminderDTO>(`/reminders/${id}`);
        return response.data;
    }

    async createReminder(data: ReminderDTO): Promise<ReminderDTO> {
        const response = await this.client.post<ReminderDTO>('/reminders', data);
        return response.data;
    }

    async updateReminder(id: number, data: ReminderDTO): Promise<ReminderDTO> {
        const response = await this.client.put<ReminderDTO>(`/reminders/${id}`, data);
        return response.data;
    }

    async toggleReminderActive(id: number): Promise<ReminderDTO> {
        const response = await this.client.patch<ReminderDTO>(`/reminders/${id}/toggle`);
        return response.data;
    }

    async deleteReminder(id: number): Promise<void> {
        await this.client.delete(`/reminders/${id}`);
    }

    // History endpoints
    async getHistoryByUserId(
        userId: number,
        start?: string,
        end?: string
    ): Promise<HistoryEventDTO[]> {
        const response = await this.client.get<HistoryEventDTO[]>('/history', {
            params: { userId, start, end },
        });
        return response.data;
    }

    async getHistoryEventById(id: number): Promise<HistoryEventDTO> {
        const response = await this.client.get<HistoryEventDTO>(`/history/${id}`);
        return response.data;
    }

    async createHistoryEvent(data: HistoryEventDTO): Promise<HistoryEventDTO> {
        const response = await this.client.post<HistoryEventDTO>('/history', data);
        return response.data;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export storage keys for use in auth context
export { STORAGE_KEYS };
