import { useState } from "react";

import PollCreateForm from "../../components/poll/PollCreateForm";

const PollCreatePage = () => {
    const [question, setQuestion] = useState<string>("How is your day?");

    const [options, setOptions] = useState<string[]>(["Good", "fifty-fifty", "Bad :("]);

    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    const handleOptionsChange = (newOptions: string[]) => {
        setOptions(newOptions);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("FORM SUBMIT");
        console.log(question);
        console.log(options);
    };

    return (
        <div className="flex w-full max-h-full items-center justify-center flex-col gap-4">
            <h3>Create a new poll</h3>

            <div className="w-full lg:max-w-2/3 bg-gray-100 h-full flex min-h-0 flex-col p-5 md:p-10 rounded-xl gap-5 md:gap-10">
                <h3>Fill the form</h3>

                <PollCreateForm
                    options={options}
                    question={question}
                    onChangeQuestion={handleQuestionChange}
                    onChangeOptions={handleOptionsChange}
                    onSubmit={handleFormSubmit}
                    className="max-h-full min-h-0"
                />
            </div>
        </div>
    );
};

export default PollCreatePage;
