import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import './Header.css'

export default function Header() {
    let {user, logoutUser} = useContext(AuthContext);

    return (
        <div className='header'>
            <nav>
                {user ? (
                    <>
                        <span>Hello {user.username}</span>
                        <span> | </span>
                        <Link to="" onClick={logoutUser}>Logout</Link>
                    </>
                ):(
                    <Link to="/login">Login</Link>
                )
                }
            </nav>
        </div>
    )
}
