import { useState } from "react";

export function usePending() {
    const [isPending, setIsPending] = useState(false);

    const setPendingStatus = (status: boolean) => setIsPending(status);

    return { isPending, setPendingStatus };
}
