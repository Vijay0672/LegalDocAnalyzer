import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/auth/me', {
                withCredentials: true
            });
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, {
            withCredentials: true
        });
        setUser(data);
        return data;
    };

    const signup = async (email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/signup', { email, password }, {
            withCredentials: true
        });
        setUser(data);
        return data;
    };

    const logout = async () => {
        await axios.post('http://localhost:5000/api/auth/logout', {}, {
            withCredentials: true
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
