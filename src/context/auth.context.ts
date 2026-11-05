import { createContext } from "react";
import type { AuthContextType } from "../interface/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

