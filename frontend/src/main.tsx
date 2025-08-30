import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";

import { FreeDrawView } from "./views/FreeDrawView";
import { GuidedDrawView } from "./views/GuidedDrawView";
import { HomeView } from "./views/HomeView";
import { QuickDrawView } from "./views/QuickDrawView";

import { EditorContextProvider } from "./utils/EditorContextProvider";
import { SettingsContextProvider } from "./utils/SettingsContextProvider";

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
      {
        path: "/guideddraw",
        element: <GuidedDrawView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsContextProvider>
      <EditorContextProvider>
        <RouterProvider router={router} />
      </EditorContextProvider>
    </SettingsContextProvider>
  </React.StrictMode>,
);
