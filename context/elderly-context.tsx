import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';
import type { UserDTO, ApiError } from '../api/types';
import { useAuth } from './auth-context';

interface ElderlyContextType {
    elderly: UserDTO | null;
    isLoading: boolean;
    error: ApiError | null;
    refreshElderly: () => Promise<void>;
    clearError: () => void;
}

const ElderlyContext = createContext<ElderlyContextType | undefined>(undefined);

interface ElderlyProviderProps {
    children: ReactNode;
}

export function ElderlyProvider({ children }: ElderlyProviderProps) {
    const { user, isAuthenticated } = useAuth();
    const [elderly, setElderly] = useState<UserDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated && user) {
            loadElderly();
        } else {
            setElderly(null);
            setError(null);
        }
    }, [isAuthenticated, user]);

    const loadElderly = async (isRetry = false) => {
        try {
            setIsLoading(true);
            if (!isRetry) {
                setError(null);
            }
            
            const elderlyList = await apiClient.getElderlyUnderCare();

            if (elderlyList && elderlyList.length > 0) {
                setElderly(elderlyList[0]);
                setError(null);
                setRetryCount(0); // Reset retry count on success
            } else {
                setError({ message: 'No se encontró información del adulto mayor' } as ApiError);
                setElderly(null);
            }
        } catch (err: any) {
            console.log('[ElderlyContext] Error loading elderly (attempt ' + (retryCount + 1) + '):', err.message || err);
            
            const apiError = err as ApiError;
            setError(apiError);
            
            if (retryCount < 2 && (!apiError.status || apiError.status >= 500)) {
                setRetryCount(retryCount + 1);
                const delay = Math.pow(2, retryCount + 1) * 1000;
                setTimeout(() => {
                    loadElderly(true);
                }, delay);
            } else {
                setElderly(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const refreshElderly = async () => {
        await loadElderly();
    };

    const clearError = () => {
        setError(null);
    };

    const value: ElderlyContextType = {
        elderly,
        isLoading,
        error,
        refreshElderly,
        clearError,
    };

    return <ElderlyContext.Provider value={value}>{children}</ElderlyContext.Provider>;
}

export function useElderly(): ElderlyContextType {
    const context = useContext(ElderlyContext);
    if (context === undefined) {
        throw new Error('useElderly must be used within an ElderlyProvider');
    }
    return context;
}
