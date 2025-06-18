import { type BaseiconProps } from "./types";

const BaseIcon: React.FC<BaseiconProps> = ({ icon, className }) => {
    return (
        <svg className={className}>
            <use xlinkHref={`#${icon}`}></use>
        </svg>
    );
};

export default BaseIcon;
