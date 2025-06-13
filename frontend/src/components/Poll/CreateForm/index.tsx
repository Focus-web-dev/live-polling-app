import { memo } from "react";

import BaseInput from "../../Base/Input";
import BaseTextArrayInput from "../../Base/TextArrayInput";

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

            <button className="button" type="submit" disabled={isPending}>
                Submit
            </button>
        </form>
    );
};

export default memo(PollCreateForm);
