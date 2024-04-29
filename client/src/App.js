import { React } from "react";
import "./App.css";
import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListingAnalyzer from "./components/ListingAnalyzer";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Callback from "./components/Callback";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import Landing from "./components/Landing";
import Addmember from "./components/Addmember";
import Setting from "./components/Setting";

function App() {
  return (
    <div className="page">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Landing />}></Route>
            <Route exact path="/dashboard" element={<Dashboard />}></Route>

            <Route exact path="/signin" element={<Signin />}></Route>
            <Route exact path="/signup" element={<Signup />}></Route>
            <Route
              exact
              path="/forgotpassword"
              element={<ForgotPassword />}
            ></Route>
            <Route exact path="/callback" element={<Callback />}></Route>

            <Route
              exact
              path="/ListingAnalyzer"
              element={<ListingAnalyzer />}
            ></Route>

            <Route exact path="/addmember" element={<Addmember />}></Route>
            <Route exact path="/setting" element={<Setting />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <footer>
        <div className="divider"></div>
        <p>
          The term " Etsy " is a trademark of Etsy, Inc. This application uses
          the Etsy API but is not endorsed or certified by Etsy, Inc.
        </p>
      </footer>
    </div>
  );
}
// }

export default App;
