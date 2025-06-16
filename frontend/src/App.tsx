import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import pagesData from "./routes/routes";

const App = () => {
    const router = createBrowserRouter(pagesData);

    return (
        <main className="flex h-full w-full p-5 md:p-10">
            <RouterProvider router={router} />
            <Toaster />
        </main>
    );
};

export default App;
