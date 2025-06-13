import BaseInput from "../../components/base/BaseInput";
import BaseTextArrayInput from "../../components/base/BaseTextArrayInput";

interface PollCreateFormProps {
    question: string;
    options: string[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onQuestionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOptionValueChange: (index: number, newValue: string) => void;
    onOptionAdd: () => void;
    onOptionRemove: (index: number) => void;
    onOptionMove: (fromIndex: number, toIndex: number) => void;
    className: string;
}

const PollCreateForm: React.FC<PollCreateFormProps> = ({
    question,
    options,
    className,
    onSubmit,
    onQuestionChange,
    onOptionValueChange,
    onOptionAdd,
    onOptionRemove,
    onOptionMove,
}) => {
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
                    onChange={onQuestionChange}
                />

                <BaseTextArrayInput
                    id="poll-options"
                    label="Poll options:"
                    value={options}
                    onItemValueChange={onOptionValueChange}
                    onItemAdd={onOptionAdd}
                    onItemRemove={onOptionRemove}
                    onItemMove={onOptionMove}
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
