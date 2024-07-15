import "tldraw/tldraw.css";

import { Header } from "./components/Header";
import { FreeDrawView } from "./views/FreeDrawView";

function App() {
  return (
    <>
      <Header />
      <FreeDrawView />
    </>
  );
}

export default App;
