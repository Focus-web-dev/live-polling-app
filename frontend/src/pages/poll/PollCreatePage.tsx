import { useCallback, useState } from "react";

import PollCreateForm from "../../components/poll/PollCreateForm";

const PollCreatePage = () => {
    const [question, setQuestion] = useState<string>("How is your day?");

    const [options, setOptions] = useState<string[]>(["Good", "fifty-fifty", "Bad :("]);

    const handleQuestionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    }, []);

    const handleOptionValueChange = useCallback(
        (index: number, newValue: string) => {
            const newOptions = [...options];
            newOptions[index] = newValue;
            setOptions(newOptions);
        },
        [options]
    );

    const handleOptionAdd = useCallback(() => {
        setOptions([...options, ""]);
    }, [options]);

    const handleOptionRemove = useCallback(
        (index: number) => {
            setOptions([...options.slice(0, index), ...options.slice(index + 1)]);
        },
        [options]
    );

    const handleOptionMove = useCallback(
        (fromIndex: number, toIndex: number) => {
            if (fromIndex === toIndex || toIndex < 0) {
                return;
            }

            const newValue = [...options];
            const element = newValue[fromIndex];

            newValue.splice(fromIndex, 1);
            newValue.splice(toIndex, 0, element);

            setOptions(newValue);
        },
        [options]
    );

    const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("FORM SUBMIT");
    }, []);

    return (
        <div className="flex w-full max-h-full items-center justify-center flex-col gap-4">
            <h3>Create a new poll</h3>

            <div className="w-full lg:max-w-2/3 bg-gray-100 h-full flex min-h-0 flex-col p-5 md:p-10 rounded-xl gap-5 md:gap-10">
                <h3>Fill the form</h3>

                <PollCreateForm
                    options={options}
                    question={question}
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
