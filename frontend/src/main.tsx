import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { FreeDrawView } from "./views/FreeDrawView";
import { QuickDrawView } from "./views/QuickDrawView";
import { HomeView } from "./views/HomeView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeView />,
      },
      {
        path: "/freedraw",
        element: <FreeDrawView />,
      },
      {
        path: "/quickdraw",
        element: <QuickDrawView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
