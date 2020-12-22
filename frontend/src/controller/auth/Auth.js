import React, { useState, useEffect } from 'react';

export const AuthContext = React.createContext();

export const AuthProvicer = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("usertoken");
        setCurrentUser(token);
        setPending(false)
    }, []);

    if (pending) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{ currentUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}

