import { createContext } from "react";

export type Role = "admin" | "viewer" | null;

export type User = {
    role: Role;
    name?: string | null;
};

export type AuthCtx = {
    user: User;
    login: (role: Exclude<Role, null>, name?: string) => void;  // TODO: change to JWT
    logout: () => void;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);