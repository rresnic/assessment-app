import { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // const login = async (phone) => {
    //     // setUser(phone);
    //     // await AsyncStorage.setItem('rysrmanUser', JSON.stringify({user}))
        
    // };

    const login = async (phone, errorAttempts, captchaToken, honeypot, timeToken) => {
        const response = await fetch('https://assessment-server-tr6b.onrender.com/userapi/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            errorAttempts,
            captchaToken,
            honeypot,
            timeToken,
          }),
        });
    
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Login failed.');
        }
    
        setUser(phone); 
        await AsyncStorage.setItem('rysrmanUser', JSON.stringify({ user: phone }));
    }
    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('rysrmanUser');
    }

    // const register = async (fullname, username, phone, password) => {
    //     setUser({ username });
    //     await AsyncStorage.setItem('user', JSON.stringify({ username }));
    // };
    
    const checkAuth = async () => {
        const storedUser = await AsyncStorage.getItem('rysrmanUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
