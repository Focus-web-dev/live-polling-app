const BaseIconSprite = () => {
    return (
        <svg width="0" height="0" className="hidden">
            <symbol id="key" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path
                    fill="currentColor"
                    d="M21 2a8.998 8.998 0 0 0-8.612 11.612L2 24v6h6l10.388-10.388A9 9 0 1 0 21 2Zm0 16a7.013 7.013 0 0 1-2.032-.302l-1.147-.348-.847.847-3.181 3.181L12.414 20 11 21.414l1.379 1.379-1.586 1.586L9.414 23 8 24.414l1.379 1.379L7.172 28H4v-3.172l9.802-9.802.848-.847-.348-1.147A7 7 0 1 1 21 18Z"
                />
                <circle cx="22" cy="10" r="2" fill="currentColor" />
            </symbol>

            <symbol
                id="time"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
            >
                <path
                    fill="currentColor"
                    d="M8 15c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7ZM8 2C4.69 2 2 4.69 2 8s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6Z"
                />
                <path
                    fill="currentColor"
                    d="M10 10.5c-.09 0-.18-.02-.26-.07l-2.5-1.5A.495.495 0 0 1 7 8.5v-4c0-.28.22-.5.5-.5s.5.22.5.5v3.72l2.26 1.35a.502.502 0 0 1-.26.93Z"
                />
            </symbol>

            <symbol id="tick" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="currentColor" fillOpacity="0.2" />
                <path
                    d="M6 10.5L9 13.5L14 8.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </symbol>
        </svg>
    );
};

export default BaseIconSprite;
