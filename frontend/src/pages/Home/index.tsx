import { NavLink } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="flex flex-col gap-10 p-10">
            <section className="w-full rounded-xl bg-gray-100 p-10">
                <div className="flex flex-row items-center justify-between hover:opacity-75">
                    <h3>Poll queue</h3>
                    <NavLink to="/poll/create">Create a poll</NavLink>
                </div>

                <ul>
                    <li></li>
                </ul>
            </section>

            <section className="w-full rounded-xl bg-white p-10">
                <h3>Live poll</h3>
            </section>
        </div>
    );
};

export default HomePage;
