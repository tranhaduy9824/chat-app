import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Chat from "./pages/Chat";
import { AuthContextProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingBar from "./components/LoadingBar";
import NotificationList from "./components/NotificationList";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <LoadingProvider>
      <NotificationProvider>
        <AuthContextProvider>
          <LoadingBar />
          <NotificationList />
          <div className="w-100 h-100 m-0">
            <NavBar />
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AuthContextProvider>
      </NotificationProvider>
    </LoadingProvider>
  );
}

export default App;
