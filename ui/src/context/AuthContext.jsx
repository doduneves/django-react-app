import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({children}){

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

    const navigate = useNavigate()

    async function loginUser(e){
        e.preventDefault()

        const res = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': e.target.username.value,
                'password': e.target.password.value
            })
        })

        const data = await res.json()

        if (res.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        }else{
            alert("somethings wrong")
        }

    }

    async function logoutUser(){
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let contextData = {
        user: user,
        setUser: setUser,
        authTokens: authTokens,
        setAuthTokens: setAuthTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {
        if(authTokens){
            setUser(jwtDecode(authTokens.access))
        }
    }, [authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}