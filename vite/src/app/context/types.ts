export interface AuthContextData {
  user: UserProps | null;
  setUser: (user: UserProps) => void;
  signInStepOne: (email: string, password: string, captchaToken: string) => Promise<void>;
  signOut: () => void;
  forgotPasswordStepOne: (email: string) => Promise<void>;
  forgotPasswordStepTwo: (email: string, verificationCode: string) => Promise<void>;
  forgotPasswordStepThree: (email: string, newPassword: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  validateUser: (email: string, verificationCode: string) => Promise<void>;
}

export interface UserProps {
  id?: number;
  email: string;
  password: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}
