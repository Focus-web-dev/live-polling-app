import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import API from "../../../services/API";
import PollCreateForm from "../../../components/Poll/CreateForm";
import { usePending } from "../../../hooks/usePending";

const PollCreatePage = () => {
    const [question, setQuestion] = useState<string>("How is your day?");

    const [options, setOptions] = useState<string[]>(["Good", "fifty-fifty", "Bad :("]);

    const navigate = useNavigate();
    const formPending = usePending();

    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    const handleOptionValueChange = (index: number, newValue: string) => {
        const newOptions = [...options];
        newOptions[index] = newValue;
        setOptions(newOptions);
    };

    const handleOptionAdd = () => {
        setOptions([...options, ""]);
    };

    const handleOptionRemove = (index: number) => {
        setOptions([...options.slice(0, index), ...options.slice(index + 1)]);
    };

    const handleOptionMove = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || toIndex < 0) {
            return;
        }

        const newValue = [...options];
        const element = newValue[fromIndex];

        newValue.splice(fromIndex, 1);
        newValue.splice(toIndex, 0, element);

        setOptions(newValue);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const poll = {
            title: question,
            options,
        };

        formPending.setPendingStatus(true);

        try {
            await API.create("/polls", JSON.stringify(poll));
            toast.success("Created successfully");
            await navigate("/");
        } catch {
            toast.error("An error occured");
        } finally {
            formPending.setPendingStatus(false);
        }
    };

    return (
        <div className="flex max-h-full w-full flex-col items-center justify-center gap-4">
            <h3>Create a new poll</h3>

            <div className="lg:max-w-2/3 segment flex h-full min-h-0 w-full flex-col gap-5 md:gap-10">
                <h3>Fill the form</h3>

                <PollCreateForm
                    options={options}
                    question={question}
                    isPending={formPending.isPending}
                    onQuestionChange={handleQuestionChange}
                    onOptionValueChange={handleOptionValueChange}
                    onOptionAdd={handleOptionAdd}
                    onOptionRemove={handleOptionRemove}
                    onOptionMove={handleOptionMove}
                    onSubmit={handleFormSubmit}
                    className="max-h-full min-h-0"
                />
            </div>
        </div>
    );
};

export default PollCreatePage;
