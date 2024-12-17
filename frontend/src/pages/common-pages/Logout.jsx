import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../authProvider/AuthProvider';

export default function Logout() {
 const {LogoutUser} = useAuth()

    useEffect(()=>{
        LogoutUser()
    }, [LogoutUser])

  return (
    <Navigate to='/login'/>
  )
}
