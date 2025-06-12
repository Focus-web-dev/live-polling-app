import { NavLink } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="p-10 flex flex-col gap-10">
            <section className="bg-white w-full p-10 rounded-xl ">
                <div className="flex flex-row justify-between items-center">
                    <h3>Poll queue</h3>
                    <NavLink to="/poll/create">Create a poll</NavLink>
                </div>

                <ul>
                    <li></li>
                </ul>
            </section>

            <section className="bg-white w-full p-10 rounded-xl">
                <h3>Live poll</h3>
            </section>
        </div>
    );
};

export default HomePage;
