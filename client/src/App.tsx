import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Chat from "./pages/Chat";
import { AuthContext } from "./context/AuthContext";
import LoadingBar from "./components/LoadingBar";
import NotificationList from "./components/NotificationList";
import { useContext } from "react";
import { ChatContextProvider } from "./context/ChatContext";

function App() {
  const { user } = useContext(AuthContext)!;

  return (
    <ChatContextProvider user={user}>
      <LoadingBar />
      <NotificationList />
      <div className="w-100 h-100 m-0">
        <NavBar />
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/Login" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ChatContextProvider>
  );
}

export default App;
