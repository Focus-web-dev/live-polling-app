import type { InputHTMLAttributes } from "react";

export type TextItem = {
    id: string;
    value: string;
};

export interface BaseTextArrayInputProps {
    id: string;
    value: TextItem[];
    label?: string;
    onItemValueChange: (index: number, newValue: string) => void;
    onItemAdd: () => void;
    onItemRemove: (index: number) => void;
    onItemMove: (fromIndex: number, toIndex: number) => void;
    className?: string;
}

export interface ItemInputProps extends InputHTMLAttributes<HTMLInputElement> {
    item: TextItem;
    index: number;
    isLast: boolean;
    onItemInputChange: (index: number, newValue: string) => void;
    onItemInputRemove: (index: number) => void;
    onItemInputMove: (fromIndex: number, toIndex: number) => void;
}
