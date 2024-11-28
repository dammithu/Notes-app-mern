import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import EditNote from "./pages/Home/EditNote";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard/:userId" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/editnote/:noteId" element={<EditNote />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
