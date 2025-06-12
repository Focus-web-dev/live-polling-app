import BaseInput from "../../components/base/BaseInput";
import BaseTextArrayInput from "../../components/base/BaseTextArrayInput";

interface PollCreateFormProps {
    question: string;
    options: string[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChangeQuestion: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeOptions: (options: string[]) => void;
    className: string;
}

const PollCreateForm: React.FC<PollCreateFormProps> = ({
    question,
    options,
    onSubmit,
    onChangeOptions,
    onChangeQuestion,
    className,
}) => {
    const handleOptionValueChange = (newValue: string, index: number) => {
        const newArray = [...options];
        newArray[index] = newValue;
        onChangeOptions(newArray);
    };

    const handleOptionAdd = () => {
        onChangeOptions([...options, ""]);
    };

    const handleOptionRemove = (index: number) => {
        onChangeOptions([...options.slice(0, index), ...options.slice(index + 1)]);
    };

    const handleOptionMove = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || toIndex < 0) {
            return;
        }

        const newValue = [...options];
        const element = newValue[fromIndex];

        newValue.splice(fromIndex, 1);
        newValue.splice(toIndex, 0, element);

        onChangeOptions(newValue);
    };

    return (
        <form
            className={`flex flex-col gap-5 md:gap-10 justify-between h-full ${className || ""}`}
            onSubmit={onSubmit}
        >
            <div className="flex flex-col gap-4 h-full min-h-0">
                <BaseInput
                    id="poll-question"
                    label="Poll question:"
                    value={question}
                    onChange={onChangeQuestion}
                />

                <BaseTextArrayInput
                    id="poll-options"
                    label="Poll options:"
                    value={options}
                    onItemValueChange={handleOptionValueChange}
                    onItemAdd={handleOptionAdd}
                    onItemRemove={handleOptionRemove}
                    onItemMove={handleOptionMove}
                    className="min-h-0 max-h-full"
                />
            </div>

            <button className="button" type="submit">
                Submit
            </button>
        </form>
    );
};

export default PollCreateForm;
