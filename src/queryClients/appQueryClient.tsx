import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export const appQueryClient = new QueryClient();

export const AppQueryClientProvider = ({ children }: { children: React.ReactElement }) => {
    return <QueryClientProvider client={appQueryClient}>{children}</QueryClientProvider>;
};
