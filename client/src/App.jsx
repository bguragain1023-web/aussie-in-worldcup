import { useState } from "react";
import "./App.css";
import { Adminpage } from "./component/Adminpage";
import { Footer } from "./component/Footer";
import { Hero } from "./component/Hero";
import { Navbar } from "./component/Navbar";
import { PasswordModal } from "./component/PasswordModal";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="wrapper">
        <Navbar onAdminClick={() => setShowModal(true)} />
        {showModal && (
          <PasswordModal
            onSuccess={(enteredPassword) => {
              setPassword(enteredPassword);
              setIsAdmin(true);
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
          />
        )}

        {isAdmin ? (
          <Adminpage
            onLogout={() => {
              setIsAdmin(false);
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
