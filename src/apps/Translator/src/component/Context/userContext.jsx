

import React, { createContext, useEffect, useState } from 'react';
export const AuthContext = createContext();


const UserContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [DUser, setDUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // <----------------------------chatting end---------------------->
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user from local storage:', error);
            }
        }
        setLoading(false);
    }, []);


    const authInfo = {
        user,
        DUser,
        setDUser,
        setUser,
        loading,
        setLoading,

    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default UserContext;
