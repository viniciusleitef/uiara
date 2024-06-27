import {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
  useCallback,
} from "react";
import { AuthContextData, UserProps } from "./types";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserProps | null>(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const navigate = useNavigate();

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      return new Promise((resolve) => {
        const newUser = { email, password };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/");
        resolve();
      });
    },
    [navigate]
  );

  const signOut = useCallback((): void => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  const memorizedValues = useMemo(
    () => ({
      user,
      setUser,
      signIn,
      signOut,
    }),
    [user, setUser, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={memorizedValues}>
      {children}
    </AuthContext.Provider>
  );
};
