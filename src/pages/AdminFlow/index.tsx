import React, { ReactElement, useEffect } from 'react';
import { MemoryRouter, Location, Params } from 'react-router-dom';

import { Box, HiverThemeProvider } from '@hiver/hiver-ui-kit';
import { CommonSnackbar } from '@components/CommonSnackBar';
import { AppQueryClientProvider } from '@queryClients/appQueryClient';
import { ISmUser, PromptModalType } from '@gTypes/approvalList';
import { setAppUserId } from '@helper/api';
import { createListnerToListenFromOuterWorld } from '@helper/globalListner';

import { AdminFlowPages } from './pages';
import { StoreProvider } from './storeContext';

type PanelProps = {
    onNavigate: (path: string) => void;
    browserLocation: Location;
    browserParams: Params;
    smUsers: ISmUser[];
    isMocked?: boolean;
    navigationPrompt?: ReactElement;
    navigationPromtModal?: PromptModalType;
    userId: string;
    enabled: boolean;
    domain: string;
    toggleApprovals: (status: boolean) => Promise<unknown>;
};

export const ApprovalsRouter = ({ children }: { children: React.ReactElement }) => {
    return <MemoryRouter>{children}</MemoryRouter>;
};

export const ApprovalsConfigurationPanel = ({
    onNavigate,
    browserLocation,
    browserParams,
    smUsers,
    navigationPrompt,
    navigationPromtModal,
    userId,
    enabled,
    toggleApprovals,
    isMocked = false,
    domain,
}: PanelProps) => {
    // configuring the app user id
    setAppUserId(userId);

    // listning to all outer events
    useEffect(() => {
        if (import.meta.env.PROD) {
            createListnerToListenFromOuterWorld();
        }
    }, []);

    return (
        <ApprovalsRouter>
            <StoreProvider
                navigateInParentWindow={onNavigate}
                browserLocation={browserLocation}
                browserParams={browserParams}
                smUsers={smUsers}
                isMocked={isMocked}
                enabled={enabled}
                toggleApprovalsApi={toggleApprovals}
                domain={domain}
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
                            <AdminFlowPages
                                navigationPrompt={navigationPrompt}
                                navigationPromtModal={navigationPromtModal}
                            />
                            <CommonSnackbar />
                        </HiverThemeProvider>
                    </Box>
                </AppQueryClientProvider>
            </StoreProvider>
        </ApprovalsRouter>
    );
};
