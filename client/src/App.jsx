import { useState } from "react";
import "./App.css";
import { Adminpage } from "./component/Adminpage";
import { Footer } from "./component/Footer";
import { Hero } from "./component/Hero";
import { Navbar } from "./component/Navbar";
import { PasswordModal } from "./component/PasswordModal";
import { getDocuments } from "./api/axios";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleOnPasswordSubmit = async (password) => {
    try {
      await getDocuments(password);
      setPassword(password);
      setIsAdmin(true);
      setShowModal(false);
      setAuthError("");
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthError("Wrong Password!! Try again ");
      }
    }
  };

  return (
    <>
      <div className="wrapper">
        <Navbar onAdminClick={() => setShowModal(true)} />
        {showModal && (
          <PasswordModal
            onSuccess={handleOnPasswordSubmit}
            onClose={() => setShowModal(false)}
            onError={authError}
          />
        )}

        {isAdmin ? (
          <Adminpage
            onLogout={() => {
              setIsAdmin(false);
              setShowModal(false);
              setPassword("");
            }}
            password={password}
          />
        ) : (
          <Hero />
        )}

        <Footer />
      </div>
    </>
  );
}

export default App;
