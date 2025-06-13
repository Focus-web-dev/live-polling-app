import React, { memo } from "react";
import type { InputHTMLAttributes } from "react";

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}

const BaseInput: React.FC<BaseInputProps> = ({
    label,
    id,
    value,
    onChange,
    className,
    ...rest
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className || ""}`}>
            {label && (
                <label htmlFor={id} className="text-white text-lg font-medium">
                    {label}
                </label>
            )}
            <input
                id={id}
                value={value}
                onChange={onChange}
                className="w-full p-2 md:p-3 bg-primary text-white focus:outline-none placeholder-white/40 rounded-lg"
                {...rest}
            />
        </div>
    );
};

export default memo(BaseInput);
