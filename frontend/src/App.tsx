import "tldraw/tldraw.css";

import { Header } from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isHomeView = location.pathname === "/";

  return (
    <>
      {!isHomeView && <Header />}
      <Outlet />
    </>
  );
}

export default App;
