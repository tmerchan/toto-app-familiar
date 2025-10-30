import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const defaultProfile: Profile = {
  name: 'Tamara González',
  email: 'tamara.gonzalez@email.com',
  phone: '+56 9 1234 5678',
  address: 'Santiago, Chile',
  birthdate: '15/03/1985',
  photoUri: null,
};

const Ctx = createContext<ProfileCtx | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [acceptedTerms, setAcceptedTermsState] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const rawProfile = await AsyncStorage.getItem('@profile');
        const rawTerms = await AsyncStorage.getItem('@acceptedTerms');
        if (rawProfile) setProfileState(JSON.parse(rawProfile));
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
  const updateProfile = (partial: Partial<Profile>) => persistProfile({ ...profile, ...partial });
  const resetProfile = () => persistProfile(defaultProfile);

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
