import {
  createContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { baseUrl, postRequest } from "../utils/services";
import { AuthContextType, User, RegisterInfo, LoginInfo } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    fullname: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info: LoginInfo) => {
    setLoginInfo(info);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("User");

    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const registerUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        registerInfo
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response.error);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        loginInfo
      );

      setIsLoginLoading(false);

      if (response.error) {
        return setLoginError(response.error);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginInfo,
        loginError,
        isLoginLoading,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
