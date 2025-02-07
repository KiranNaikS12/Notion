import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

const PrivateRoute:React.FC = () => {
   const { userInfo } = useSelector((state:RootState) => state.user)
   return userInfo ? <Outlet/> : <Navigate to = "/login" replace/>
}

export default PrivateRoute
