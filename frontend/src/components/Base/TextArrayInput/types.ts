import type { InputHTMLAttributes } from "react";

export interface BaseTextArrayInputProps {
    id: string;
    value: string[];
    label?: string;
    onItemValueChange: (index: number, newValue: string) => void;
    onItemAdd: () => void;
    onItemRemove: (index: number) => void;
    onItemMove: (fromIndex: number, toIndex: number) => void;
    className: string;
}

export interface ItemInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    index: number;
    itemValue: string;
    isLast: boolean;
    onItemInputChange: (index: number, newValue: string) => void;
    onItemInputRemove: (index: number) => void;
    onItemInputMove: (fromIndex: number, toIndex: number) => void;
}
