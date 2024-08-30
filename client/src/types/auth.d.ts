export interface User {
  id: string;
  fullname: string;
  email: string;
}

export interface RegisterInfo {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: RegisterInfo) => void;
  registerUser: (e: React.FormEvent) => Promise<void>;
  isRegisterLoading: boolean;
  logoutUser: () => void;
  loginUser: (e: React.FormEvent) => Promise<void>;
  loginInfo: LoginInfo;
  updateLoginInfo: (info: LoginInfo) => void;
  isLoginLoading: boolean;
}
