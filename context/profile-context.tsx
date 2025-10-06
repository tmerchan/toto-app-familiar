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

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@profile');
        if (raw) setProfileState(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const persist = async (p: Profile) => {
    setProfileState(p);
    try { await AsyncStorage.setItem('@profile', JSON.stringify(p)); } catch {}
  };

  const setProfile = (p: Profile) => persist(p);
  const updateProfile = (partial: Partial<Profile>) => persist({ ...profile, ...partial });
  const resetProfile = () => persist(defaultProfile);

  return <Ctx.Provider value={{ profile, setProfile, updateProfile, resetProfile }}>{children}</Ctx.Provider>;
};

export const useProfile = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProfile must be used within ProfileProvider');
  return v;
};
