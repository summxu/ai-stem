import { Models } from 'appwrite';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { account, functions } from '../utils/appwrite.ts';
import { message } from 'antd';
import { FunctionName } from '../../types/enums.ts';
import { FunctionsReturn } from '../../types/common.ts';

interface UserContextType {
    userInfo: Models.User<Models.Preferences> | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
    userInfo: null,
    login(): Promise<void> {
        return Promise.resolve(undefined);
    },
    logout(): Promise<void> {
        return Promise.resolve(undefined);
    },
});

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider(props: PropsWithChildren) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    async function login(email: string, password: string) {
        try {
            const { responseBody } = await functions.createExecution(FunctionName.login, JSON.stringify({
                email: `${email}@istem.com`,
                password,
            }));
            const { status, data, message }: FunctionsReturn<Models.Token & {
                userId: string
            }> = JSON.parse(responseBody);
            if (!status) {
                throw new Error(message);
            }
            await account.createSession(data.userId, data.secret);
            init();
        } catch (e: any) {
            message.error(e.message);
            throw new Error(e.message);
        }
    }

    async function logout() {
        await account.deleteSession('current').catch(err => message.error(err.message));
        setUser(null);
    }

    async function init() {
        try {
            const loggedIn = await account.get();
            setUser(loggedIn);
        } catch (err) {
            setUser(null);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <UserContext.Provider value={{ userInfo: user, login, logout }}>
            {props.children}
        </UserContext.Provider>
    );
}
