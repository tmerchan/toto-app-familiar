import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, STORAGE_KEYS } from '../api/client';
import type {
    LoginRequest,
    RegisterRequest,
    UserDTO,
    LoginResponse,
    ApiError,
} from '../api/types';

interface AuthContextType {
    user: UserDTO | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: ApiError | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const [storedUser, accessToken] = await AsyncStorage.multiGet([
                STORAGE_KEYS.USER,
                STORAGE_KEYS.ACCESS_TOKEN,
            ]);

            if (storedUser[1] && accessToken[1]) {
                setUser(JSON.parse(storedUser[1]));

                // Optionally verify token is still valid
                try {
                    const currentUser = await apiClient.getCurrentUser();
                    setUser(currentUser);
                    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
                } catch (error) {
                    // Token invalid, clear auth
                    await clearAuth();
                }
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAuthData = async (authResponse: LoginResponse) => {
        const { accessToken, refreshToken, user: userData } = authResponse;

        const storageItems: Array<[string, string]> = [
            [STORAGE_KEYS.USER, JSON.stringify(userData)],
        ];

        // Solo guardar tokens si no son null (para casos de CAREGIVER)
        if (accessToken) {
            storageItems.push([STORAGE_KEYS.ACCESS_TOKEN, accessToken]);
        }
        if (refreshToken) {
            storageItems.push([STORAGE_KEYS.REFRESH_TOKEN, refreshToken]);
        }

        await AsyncStorage.multiSet(storageItems);
        setUser(userData);
    };

    const clearAuth = async () => {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER,
        ]);
        setUser(null);
    };

    const checkTermsStatus = async (): Promise<boolean> => {
        try {
            const rawTerms = await AsyncStorage.getItem('@acceptedTerms');
            return !rawTerms || !JSON.parse(rawTerms);
        } catch {
            return true; // Si hay error, asumir que necesita aceptar términos
        }
    };

    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true);
            setError(null);

            // Validate that email and password are not empty
            if (!credentials.email || !credentials.email.trim()) {
                throw {
                    message: 'El correo electrónico es requerido',
                    status: 400,
                } as ApiError;
            }
            
            if (!credentials.password || !credentials.password.trim()) {
                throw {
                    message: 'La contraseña es requerida',
                    status: 400,
                } as ApiError;
            }

            const response = await apiClient.login(credentials);
            await saveAuthData(response);
        } catch (err: any) {
            setError(err as ApiError);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.register(data);
            await saveAuthData(response);
        } catch (err: any) {
            setError(err as ApiError);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await clearAuth();
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
