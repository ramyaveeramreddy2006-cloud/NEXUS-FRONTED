import {Navigate,useLocation} from 'react-router-dom'; import {useAuth} from '../context/AuthContext';
export default function ProtectedRoute({children}){const {user}=useAuth();const loc=useLocation();return user?children:<Navigate to="/login" replace state={{from:loc.pathname}}/>}
