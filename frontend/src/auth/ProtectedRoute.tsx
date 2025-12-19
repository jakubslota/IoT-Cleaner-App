import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";


export default function ProtectedRoute({ children, allow}: {children: JSX.Element, allow: Array<"admin"| "viewer">}) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allow.includes(user.role!)) {
        return <Navigate to="/" replace />;
    }

    return children;

}