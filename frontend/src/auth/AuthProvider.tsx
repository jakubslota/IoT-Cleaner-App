import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./context";



export default function AuthProvider({children}: {children: ReactNode}) {

    const [user, setUser] = useState<User>({role: null, name: null});

    const value = {
        user, 
        login: (role: NonNullable<User>['role'], name?: string ) => setUser({role, name}),
        logout: () => setUser({role: null, name: null})
    };

    return ( 
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
