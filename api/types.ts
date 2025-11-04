export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string | null;
    password: string | null;
    phone?: string;
    role: 'ELDERLY' | 'CAREGIVER';
    birthdate?: string;
    address?: string;
    medicalInfo?: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface UserDTO {
    id: number;
    name: string;
    email: string | null;
    phone?: string;
    role: 'ELDERLY' | 'CAREGIVER';
    address?: string;
    birthdate?: string;
    medicalInfo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    accessToken: string | null;
    refreshToken: string | null;
    tokenType: string;
    user: UserDTO;
}

export interface ContactDTO {
    id?: number;
    elderlyId: number;
    name: string;
    relationship?: string;
    phone: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ReminderDTO {
    id?: number;
    elderlyId: number;
    reminderType: 'MEDICATION' | 'APPOINTMENT' | 'EVENT';
    title: string;
    description?: string;
    reminderTime: string; // ISO 8601 format
    repeatPattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'NONE';
    dosage?: string;
    doctor?: string;
    location?: string;
    leadTimeMinutes?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface HistoryEventDTO {
    id?: number;
    userId: number;
    eventType: string;
    details?: string;
    timestamp?: string;
}

export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    fieldErrors?: Record<string, string>;
}

export interface ApiError {
    message: string;
    status?: number;
    fieldErrors?: Record<string, string>;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    token: string;
    note: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}
