import { Link, createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Admin from "../pages/Admin";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
      path: "admin",
      element: <Admin />,
    },
]);

export default router;
