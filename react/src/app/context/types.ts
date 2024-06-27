export interface AuthContextData {
  user: UserProps | null;
  setUser: (user: UserProps) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
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
