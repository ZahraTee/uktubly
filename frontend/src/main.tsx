import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SettingsContextProvider } from "./utils/SettingsContextProvider";
import { FreeDrawView } from "./views/FreeDrawView";
import { HomeView } from "./views/HomeView";
import { QuickDrawView } from "./views/QuickDrawView";

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
    <SettingsContextProvider>
      <RouterProvider router={router} />
    </SettingsContextProvider>
  </React.StrictMode>
);
