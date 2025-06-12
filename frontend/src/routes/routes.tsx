import HomePage from "../pages/HomePage";
import PollCreatePage from "../pages/poll/PollCreatePage";

const pagesData = [
    {
        path: "",
        element: <HomePage />,
        title: "Home page",
    },
    {
        path: "poll/create",
        element: <PollCreatePage />,
        title: "Create poll page",
    },
];

export default pagesData;
