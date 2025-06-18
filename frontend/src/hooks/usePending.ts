import { useState } from "react";

export function usePending(defaultState = false) {
    const [isPending, setIsPending] = useState(defaultState);

    const setPendingStatus = (status: boolean) => setIsPending(status);

    return { isPending, setPendingStatus };
}
