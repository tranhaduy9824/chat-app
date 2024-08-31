import {
  createContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { baseUrl, postRequest } from "../utils/services";
import { AuthContextType, User, RegisterInfo, LoginInfo } from "../types/auth";
import { useLoading } from "./LoadingContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./NotificationContext";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    fullname: "",
    email: "",
    password: "",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const { setProgress } = useLoading();
  const { addNotification } = useNotification();

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

      const response = await postRequest(
        `${baseUrl}/users/register`,
        registerInfo,
        setProgress
      );

      setIsRegisterLoading(false);

      if (!response.error) {
        addNotification("Register success", "success");
        setRegisterInfo({
          fullname: "",
          email: "",
          password: "",
        });
        navigate("/login");
      } else {
        addNotification(response.message, "error");
      }
    },
    [registerInfo, setProgress, navigate, addNotification]
  );

  const loginUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoginLoading(true);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        loginInfo,
        setProgress
      );

      setIsLoginLoading(false);

      if (!response.error) {
        addNotification("Login success", "success");
        setLoginInfo({
          email: "",
          password: "",
        });
        navigate("/");

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
      } else {
        addNotification(response.message, "error");
      }
    },
    [loginInfo, setProgress, navigate, addNotification]
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
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginInfo,
        isLoginLoading,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
