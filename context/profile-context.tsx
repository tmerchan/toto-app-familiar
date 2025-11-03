import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-context';
import { apiClient } from '../api/client';

export type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  photoUri?: string | null;
};

type ProfileCtx = {
  profile: Profile;
  setProfile: (p: Profile) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  resetProfile: () => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
};

const getDefaultProfile = (): Profile => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  birthdate: '',
  photoUri: null,
});

const Ctx = createContext<ProfileCtx | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<Profile>(getDefaultProfile());
  const [acceptedTerms, setAcceptedTermsState] = useState<boolean>(false);

  // Initialize profile from user data when user logs in
  useEffect(() => {
    if (user) {
      setProfileState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthdate: user.birthdate || '',
        photoUri: null, // Photo URI is not in UserDTO, keep from local storage
      });
    } else {
      setProfileState(getDefaultProfile());
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const rawProfile = await AsyncStorage.getItem('@profile');
        const rawTerms = await AsyncStorage.getItem('@acceptedTerms');
        if (rawProfile) {
          const stored = JSON.parse(rawProfile);
          // Merge stored profile (especially photoUri) with current profile
          setProfileState(prev => ({ ...prev, photoUri: stored.photoUri }));
        }
        if (rawTerms) setAcceptedTermsState(JSON.parse(rawTerms));
      } catch {}
    })();
  }, []);

  const persistProfile = async (p: Profile) => {
    setProfileState(p);
    try { await AsyncStorage.setItem('@profile', JSON.stringify(p)); } catch {}
  };

  const persistTerms = async (value: boolean) => {
    setAcceptedTermsState(value);
    try { await AsyncStorage.setItem('@acceptedTerms', JSON.stringify(value)); } catch {}
  };

  const setProfile = (p: Profile) => persistProfile(p);
  
  const updateProfile = async (partial: Partial<Profile>) => {
    const updatedProfile = { ...profile, ...partial };
    
    // Update in backend if user exists
    if (user?.id) {
      try {
        await apiClient.updateUser(user.id, {
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          address: updatedProfile.address,
          birthdate: updatedProfile.birthdate,
        });
        // Update local state and storage
        await persistProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating profile in backend:', error);
        // Still update locally even if backend fails
        await persistProfile(updatedProfile);
        throw error;
      }
    } else {
      // Just update locally if no user
      await persistProfile(updatedProfile);
    }
  };
  
  const resetProfile = () => persistProfile(getDefaultProfile());

  return (
    <Ctx.Provider value={{ profile, setProfile, updateProfile, resetProfile, acceptedTerms, setAcceptedTerms: persistTerms }}>
      {children}
    </Ctx.Provider>
  );
};

export const useProfile = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProfile must be used within ProfileProvider');
  return v;
};
