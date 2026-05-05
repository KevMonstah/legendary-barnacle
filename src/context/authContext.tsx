import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
//import { refreshAccessToken } from '#/api/auth';
import { setStoredAccessToken } from '#/lib/authToken';
import api from '#/lib/axios';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: { id: string; name: string; email: string } | null;
  setUser: (user: AuthContextType['user']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// We are setting the default value of the context to `undefined`. This is because we will be using the context in a provider, and we want to make sure that we are using the context correctly. If we try to use the context outside of a provider, we will get an error.

// now need a provider

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string|null>(null);
    const [user, setUser] = useState<AuthContextType['user'] | null>(null);

    // useEffect(() => {
    //     const loadAuth = async () => {
    //         try {
    //             const {accessToken: newToken, user} = await refreshAccessToken();
    //             setAccessToken(newToken);
    //             setUser(user);
    //             setStoredAccessToken(newToken);
    //         } catch (err) {
    //             console.log('Failed to refresh token', err);
    //         }
    //     }

    //     loadAuth();
    // }, []); // only run on mount

    // replace the refreshAccessToken call with:
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const res = await api.post('/auth/refresh');
                const { accessToken: newToken, user } = res.data;
                setAccessToken(newToken);
                setUser(user);
                setStoredAccessToken(newToken);
            } catch (err) {
                console.log('Failed to refresh token', err);
            }
        }

        loadAuth();
    }, []);

    useEffect(() => {
        setStoredAccessToken(accessToken);
    }, [accessToken]); // when token changes

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, user, setUser }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within a provider');
    return context;
}

//const {user, accessToken } = useAuth;

