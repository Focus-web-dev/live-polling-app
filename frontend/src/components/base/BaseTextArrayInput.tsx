import React, { useCallback } from "react";
import type { InputHTMLAttributes } from "react";

import BaseInput from "./BaseInput";

interface BaseTextArrayInputProps {
    id: string;
    value: string[];
    label?: string;
    onItemValueChange: (index: number, newValue: string) => void;
    onItemAdd: () => void;
    onItemRemove: (index: number) => void;
    onItemMove: (fromIndex: number, toIndex: number) => void;
    className: string;
}

interface ItemInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    index: number;
    itemValue: string;
    isLast: boolean;
    onItemInputChange: (index: number, newValue: string) => void;
    onItemInputRemove: (index: number) => void;
    onItemInputMove: (fromIndex: number, toIndex: number) => void;
}

const ItemInput = React.memo(function ItemInput({
    id,
    index,
    itemValue,
    isLast,
    onItemInputChange,
    onItemInputRemove,
    onItemInputMove,
}: ItemInputProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onItemInputChange(index, e.target.value);
        },
        [index, onItemInputChange]
    );

    const handleItemRemove = useCallback(() => {
        onItemInputRemove(index);
    }, [index, onItemInputRemove]);

    const handleItemMoveUp = useCallback(() => {
        onItemInputMove(index, index - 1);
    }, [index, onItemInputMove]);

    const handleItemDown = useCallback(() => {
        onItemInputMove(index, index + 1);
    }, [index, onItemInputMove]);

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-2 min-h-0`}>
            <div className="flex flex-row grow items-center gap-2">
                <span className="text-lg lg:text-xl font-bold text-white">{index + 1}.</span>

                <BaseInput
                    id={`${id}-${index}`}
                    value={itemValue}
                    onChange={handleChange}
                    placeholder="Type your option..."
                    className="w-full"
                />
            </div>

            <div className="flex flex-row gap-2">
                <button type="button" className="button outlined" onClick={handleItemRemove}>
                    -
                </button>

                <button
                    type="button"
                    className="button outlined"
                    onClick={handleItemMoveUp}
                    disabled={index === 0}
                >
                    ↑
                </button>

                <button
                    type="button"
                    className="button outlined"
                    onClick={handleItemDown}
                    disabled={isLast}
                >
                    ↓
                </button>
            </div>
        </div>
    );
});

const BaseTextArrayInput: React.FC<BaseTextArrayInputProps> = ({
    id,
    label,
    value,
    onItemValueChange,
    onItemAdd,
    onItemRemove,
    onItemMove,
}) => {
    return (
        <div className="flex flex-col gap-4 rounded-lg min-h-0">
            <div className="flex flex-col gap-2 min-h-0">
                {label && <p className="text-md font-bold">{label}</p>}

                <div className="flex flex-col gap-4 border-2 border-primary p-5 rounded-xl overflow-auto">
                    {value.length ? (
                        <div className="flex flex-col gap-2">
                            {value.map((itemValue, index) => (
                                <div key={`${id}-${index}`}>
                                    <ItemInput
                                        id={id}
                                        index={index}
                                        itemValue={itemValue}
                                        isLast={index === value.length - 1}
                                        onItemInputChange={onItemValueChange}
                                        onItemInputRemove={onItemRemove}
                                        onItemInputMove={onItemMove}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="font-medium">There no any items yet</p>
                    )}

                    <button type="button" className="button outlined" onClick={onItemAdd}>
                        Add new item
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BaseTextArrayInput;
