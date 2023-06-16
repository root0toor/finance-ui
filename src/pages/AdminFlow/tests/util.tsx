import React, { ReactElement } from 'react';
import { fetch } from 'cross-fetch';
import { MemoryRouter } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { CommonSnackbar } from '@components/CommonSnackBar';
import { setAppConfig, setAppUserId } from '@helper/api';
import { AppQueryClientProvider } from '@queryClients/appQueryClient';
import { HiverThemeProvider, Box } from '@hiver/hiver-ui-kit';
import { StoreProvider } from '@pages/AdminFlow//storeContext';

global.fetch = fetch;
export const baseUrl = 'https://www.hiverhq.com';
export const v2Url = 'https://v2.hiver.com';
setAppConfig(v2Url, baseUrl, 'admin_panel');
setAppUserId('1');

export const fakeStoreProps = {
    smUsers: [
        {
            email: 'user@hiver.space',
            userid: '1',
            firstname: 'user',
            lastname: '',
        },
        {
            email: 'user@gmail.com',
            userid: '2',
            firstname: 'user',
            lastname: '',
        },
    ],
    navigateInParentWindow: vi.fn(() => {
        // to do something
    }),
    browserLocation: {
        state: '',
        key: '',
        pathname: '',
        search: '',
        hash: '',
    },
    browserParams: {
        smid: '1',
    },
    domain: 'hiver.space',
};

const AllTheProviders = ({ children }: { children: React.ReactElement }) => {
    return (
        <React.StrictMode>
            <MemoryRouter>
                <StoreProvider
                    isMocked={false}
                    navigateInParentWindow={fakeStoreProps.navigateInParentWindow}
                    browserLocation={fakeStoreProps.browserLocation}
                    browserParams={fakeStoreProps.browserParams}
                    smUsers={fakeStoreProps.smUsers}
                    enabled={true}
                    toggleApprovalsApi={(status: boolean) => {
                        return new Promise((res) => {
                            setTimeout(() => {
                                res(status);
                            }, 3000);
                        });
                    }}
                    domain={fakeStoreProps.domain}
                >
                    <AppQueryClientProvider>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                '& > .MuiScopedCssBaseline-root': {
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                },
                            }}
                        >
                            <HiverThemeProvider>
                                {children}
                                <CommonSnackbar />
                            </HiverThemeProvider>
                        </Box>
                    </AppQueryClientProvider>
                </StoreProvider>
            </MemoryRouter>
        </React.StrictMode>
    );
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
