import HomePage from "@/pages/Home";
import PollCreatePage from "@/pages/Poll/Create";

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
