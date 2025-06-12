import { createBrowserRouter, RouterProvider } from "react-router-dom";
import pagesData from "./routes/routes";

const App = () => {
    const router = createBrowserRouter(pagesData);

    return (
        <main className="flex h-full w-full p-10">
            <RouterProvider router={router} />
        </main>
    );
};

export default App;
