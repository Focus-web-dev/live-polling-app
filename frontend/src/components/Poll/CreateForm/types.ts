export interface PollCreateFormProps {
    question: string;
    options: string[];
    isPending: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onQuestionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOptionValueChange: (index: number, newValue: string) => void;
    onOptionAdd: () => void;
    onOptionRemove: (index: number) => void;
    onOptionMove: (fromIndex: number, toIndex: number) => void;
    className?: string;
}
