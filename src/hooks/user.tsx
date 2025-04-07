import {Models} from "appwrite";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {account} from "../utils/appwrite.ts";
import {message} from "antd";

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
    }
});

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider(props: PropsWithChildren) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    async function login(email: string, password: string) {
        await account.createEmailPasswordSession(email, password).catch(err => message.error(err.message))
        init()
    }

    async function logout() {
        await account.deleteSession("current").catch(err => message.error(err.message));
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
        <UserContext.Provider value={{userInfo: user, login, logout}}>
            {props.children}
        </UserContext.Provider>
    );
}
