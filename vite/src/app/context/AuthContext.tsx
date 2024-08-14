import {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AuthContextData, UserProps } from "./types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import userService from "../services/user";

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserProps | null>(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const navigate = useNavigate();

  const signInStepOne = useCallback(
    async (email: string, password: string, captchaToken: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
          //await userService.verifyCaptcha(captchaToken); 
          await userService.loginStepOne(email, password);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    [navigate]
  );

  const signInStepTwo = useCallback(
    async (email: string, password: string, verificationCode: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        const newUser = { email, password };
        try {
          const { token } = await userService.loginStepTwo(email, password, verificationCode);
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("user", JSON.stringify(newUser))
          navigate("/");  
          resolve();
          setUser(newUser);
        } catch (error) {
          reject(error);
        }
      });
    },
    [navigate]
  );

  const signOut = useCallback((): void => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    navigate("/login");
  }, [navigate]);

  const forgotPasswordStepOne = useCallback(
    async (email: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
          await userService.forgotPasswordStepOne(email);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    [navigate]
  );

  const forgotPasswordStepTwo = useCallback(
    async (email: string, verificationCode: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
          await userService.forgotPasswordStepTwo(email, verificationCode);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    [navigate]
  );

  const forgotPasswordStepThree = useCallback(
    async (email: string, newPassword: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
          await userService.forgotPasswordStepThree(email, newPassword);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    [navigate]
  );

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        signOut();
      }
    }
  }, [signOut]);

  useEffect(() => {
    checkTokenExpiration();
  }, [checkTokenExpiration]);

  const memorizedValues = useMemo(
    () => ({
      user,
      setUser,
      signInStepOne,
      signInStepTwo,
      signOut,
      forgotPasswordStepOne,
      forgotPasswordStepTwo,
      forgotPasswordStepThree,
    }),
    [user, setUser, signInStepOne, signInStepTwo, signOut, forgotPasswordStepOne, forgotPasswordStepTwo, forgotPasswordStepThree]
  );

  return (
    <AuthContext.Provider value={memorizedValues}>
      {children}
    </AuthContext.Provider>
  );
};
