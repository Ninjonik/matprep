'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import UserObject from '@/interfaces/UserObject';

import { jwtDecode } from 'jwt-decode';
import ms from 'ms';
import PocketBase, { RecordAuthResponse, RecordModel } from 'pocketbase';
import { useInterval } from 'usehooks-ts';

export const base_url = 'https://pb.igportals.eu';
const fiveMinutesInMs = ms('5 minutes');
const twoMinutesInMs = ms('2 minutes');

interface PocketContextType {
    register: (email: string, password: string) => Promise<RecordModel | false>;
    login: (email: string, password: string) => Promise<RecordAuthResponse<RecordModel> | false>;
    logout: () => void;
    user: UserObject | null;
    token: string | null;
    pb: PocketBase;
}

const defaultContextValue: PocketContextType = {
    register: async () => {
        throw new Error('register function is not available');
    },
    login: async () => {
        throw new Error('login function is not available');
    },
    logout: () => {
        throw new Error('logout function is not available');
    },
    user: null,
    token: null,
    pb: new PocketBase(base_url)
};

const PocketContext = createContext<PocketContextType>(defaultContextValue);

export const PocketProvider = ({ children }: { children: ReactNode }) => {
    const pb = useMemo(() => new PocketBase(base_url), []);

    const [token, setToken] = useState(pb.authStore.token);
    const [user, setUser] = useState<UserObject | null>(pb.authStore.model as UserObject);

    useEffect(() => {
        return pb.authStore.onChange((token, model) => {
            setToken(token);
            setUser(model as UserObject);
        });
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        try {
            return await pb.collection('users').create({ email, password, passwordConfirm: password });
        } catch (e) {
            console.error(e);

            return false;
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            return await pb.collection('users').authWithPassword(email, password);
        } catch (e) {
            console.error(e);

            return false;
        }
    }, []);

    const logout = useCallback(() => {
        pb.authStore.clear();
    }, []);

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return;
        const decoded = jwtDecode(token);
        if (!decoded || !decoded?.exp) return;
        const tokenExpiration = decoded.exp;
        const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
        if (tokenExpiration < expirationWithBuffer) {
            await pb.collection('users').authRefresh();
        }
    }, [token]);

    useInterval(refreshSession, token ? twoMinutesInMs : null);

    return (
        <PocketContext.Provider value={{ register, login, logout, user, token, pb }}>{children}</PocketContext.Provider>
    );
};

export const usePocket = () => useContext(PocketContext);
