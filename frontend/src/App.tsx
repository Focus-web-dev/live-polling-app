import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import BaseIconSprite from "./components/Base/Icon/Sprite";
import pagesData from "./routes/routes";

const App = () => {
    const router = createBrowserRouter(pagesData);

    return (
        <main className="flex h-full w-full p-5 md:p-10">
            <RouterProvider router={router} />
            <Toaster />
            <BaseIconSprite />
        </main>
    );
};

export default App;
