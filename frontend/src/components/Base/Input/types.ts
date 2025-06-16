import type { InputHTMLAttributes } from "react";

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}
