import { useContext, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";

export const setItem = (token) => {
    localStorage.setItem('token', token);
};

export const setItemUser = (user) => {
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('role', user.role);
    localStorage.setItem('created_at', user.created_at);
};

export const fetchUser = () => {
    let user = {username: localStorage.getItem('username'),
            id: localStorage.getItem('user_id'),
            role: localStorage.getItem('role'),
            created_at: localStorage.getItem('created_at')
        }
        console.log(user)
    return user;
};

export const fetchToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem("token");
}

export const AuthProvider = ({ tokenData, children }) => {
    let [token, setToken] = useState(tokenData);
    return (
        <AuthContext.Provider value={{token, setToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserProvider = ({ userData, children }) => {
    let [user, setUser] = useState(userData);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export function PrivatePath({children}) {
    let token = useAuth();
    //console.log(token)
    if(!token.token || token.token === "") {
        return <Navigate to='/login' replace />
    }
    return children
};

export function PrivateRoute({...rest}) {
    let { token } = useAuth();
    //console.log(token.token)
    if (!token || token === ""){
        return (
        <Navigate to='/login' replace/>
        )
    };
    return <Route {...rest} />
};

export function RequireAuth({children}) {
    const token = useAuth();
    console.log(token)
    if(!token.token || token.token === "") {
        return <Navigate to='/login' replace />
    }
    return children

}

export function RequireAdmin({children}) {
    const user = useUser();
    if (user.user.role === "guest"){
        return <Navigate to='/error' replace />
    }
    return children
}

export function RequireUser({children}) {
    const user = useUser();
    if (user.user.role === "superuser"){
        return <Navigate to='/chat/admin' replace />
    }
    return children
}

export const useAuth = () => useContext(AuthContext);
export const useUser = () => useContext(UserContext);