import BaseInput from "@/components/Base/Input";
import BaseTextArrayInput from "@/components/Base/TextArrayInput";

import type { PollCreateFormProps } from "./types";

const PollCreateForm: React.FC<PollCreateFormProps> = ({
    question,
    options,
    isPending,
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
            className={`flex h-full flex-col justify-between gap-5 md:gap-10 ${className || ""}`}
            onSubmit={onSubmit}
        >
            <div className="flex h-full min-h-0 flex-col gap-4">
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
                    className="max-h-full min-h-0"
                />
            </div>

            <button className="button" type="submit" disabled={isPending}>
                Submit
            </button>
        </form>
    );
};

export default PollCreateForm;
