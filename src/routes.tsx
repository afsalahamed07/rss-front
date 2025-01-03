import { RouteObject } from "react-router-dom";
import Layout from "./Layout.tsx";
import App from "./components/app/App.tsx";
import Rss from "./components/rss/Rss.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "rss", element: <Rss /> },
    ],
  },
];

export default routes;
