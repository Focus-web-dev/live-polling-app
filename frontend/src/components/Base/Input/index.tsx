import React, { memo } from "react";

import type { BaseInputProps } from "./types";

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
                <label htmlFor={id} className="text-lg font-medium text-white">
                    {label}
                </label>
            )}
            <input
                id={id}
                value={value}
                onChange={onChange}
                className="bg-primary w-full rounded-lg p-2 text-white placeholder-white/40 focus:outline-none md:p-3"
                {...rest}
            />
        </div>
    );
};

export default memo(BaseInput);
