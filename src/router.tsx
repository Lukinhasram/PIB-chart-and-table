import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PIBChart from "./components/chart";
import PIBTable from "./components/table";
import App from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <PIBChart />,
            },
            {
                path: "chart",
                element: <PIBChart />,
            },
            {
                path: "table",
                element: <PIBTable />,
            },
        ]
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}