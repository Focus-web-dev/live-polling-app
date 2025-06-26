import React, { useCallback } from "react";

import BaseInput from "@/components/Base/Input";
import type { BaseTextArrayInputProps, ItemInputProps } from "./types";

const ItemInput = React.memo(function ItemInput({
    item,
    index,
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
        <div className={`flex min-h-0 flex-col gap-2 sm:flex-row sm:items-center`}>
            <div className="flex grow flex-row items-center gap-2">
                <span className="text-lg font-bold text-white lg:text-xl">{index + 1}.</span>

                <BaseInput
                    id={item.id}
                    value={item.value}
                    onChange={handleChange}
                    placeholder="Type your option..."
                    className="w-full"
                />
            </div>

            <div className="flex flex-row gap-2">
                <button
                    type="button"
                    className="button outlined"
                    onClick={handleItemRemove}
                    aria-label={`Remove item ${index + 1}`}
                >
                    -
                </button>

                <button
                    type="button"
                    className="button outlined"
                    onClick={handleItemMoveUp}
                    disabled={index === 0}
                    aria-label={`Move item ${index + 1} up`}
                >
                    ↑
                </button>

                <button
                    type="button"
                    className="button outlined"
                    onClick={handleItemDown}
                    disabled={isLast}
                    aria-label={`Move item ${index + 1} down`}
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
    className,
}) => {
    return (
        <div
            className={`flex min-h-0 flex-col gap-4 rounded-lg${className ? ` ${className}` : ""}`}
        >
            <div className="flex min-h-0 flex-col gap-2">
                {label && <p className="text-md font-bold">{label}</p>}

                <div className="border-primary flex flex-col gap-4 overflow-auto rounded-xl border-2 p-5">
                    {value.length !== 0 ? (
                        <div className="flex flex-col gap-2">
                            {value.map((item, index) => (
                                <div key={item.id}>
                                    <ItemInput
                                        id={id}
                                        index={index}
                                        item={item}
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

                    <button
                        type="button"
                        className="button outlined"
                        aria-label="Add new item"
                        onClick={onItemAdd}
                    >
                        Add new item
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BaseTextArrayInput;
