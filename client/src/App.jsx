import "./App.css";
import { Hero } from "./component/Hero";
import { Navbar } from "./component/Navbar";

function App() {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <Hero />
      </div>
    </>
  );
}

export default App;
