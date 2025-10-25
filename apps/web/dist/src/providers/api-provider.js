import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export function APIProvider({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0,
                retry: false,
            },
        },
    }));
    return (_jsx(QueryClientProvider, { client: queryClient, children: children }));
}
