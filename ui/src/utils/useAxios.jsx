import axios from "axios"
import jwt_decode from "jwt-decode"
import dayjs from "dayjs"
import { useContext } from 'react'
import AuthContext from "../context/AuthContext"




export default function useAxios(){
    const { authTokens, setUser, setAuthTokens} = useContext(AuthContext)

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${authTokens?.access}`
        }
    })

    axiosInstance.interceptors.request.use(async req => {

        const user = jwt_decode(authTokens.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if(!isExpired) return req

        const res = await axios.post('token/refresh/', {
            refresh: authTokens.refresh
        })

        localStorage.setItem('authTokens', JSON.stringify(res.data))
        setAuthTokens(res.data)
        setUser(jwt_decode(res.data.access))

        req.headers.Authorization = `Bearer ${authTokens?.access}`

        return req
    })

    return axiosInstance
}