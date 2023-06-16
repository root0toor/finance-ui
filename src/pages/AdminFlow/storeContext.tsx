import React, { useContext, useState } from 'react';
import { Location, Params, useNavigate } from 'react-router-dom';

import { ISmUser } from '@gTypes/approvalList';
import { sendMessageToParentWindow } from '@helper/utility';

type ToggleApiFunc = {
    (status: boolean): Promise<unknown>;
};

type StoreProps = {
    navigateInParentWindow: (path: string) => void;
    browserLocation: Location;
    browserParams: Params;
    smUsers: ISmUser[];
    isMocked: boolean;
    enabled: boolean;
    toggleApprovalsApi: ToggleApiFunc;
    domain: string;
};

type InitialValueProps = {
    toggleApprovalInStore: (status: boolean) => void;
} & Omit<StoreProps, 'toggleApprovalsApi'>;

const StoreContext = React.createContext<InitialValueProps | null>(null);

type ProviderProps = {
    children: React.ReactElement;
} & StoreProps;

export const StoreProvider = ({
    children,
    navigateInParentWindow: onNavigate,
    browserLocation,
    browserParams,
    smUsers,
    isMocked,
    enabled,
    toggleApprovalsApi,
    domain,
}: ProviderProps) => {
    const [isApprovalsEnabled, setApprovalsStatus] = useState(enabled);
    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        navigate(path);
        onNavigate(path);
    };

    const toggleApprovalInStore = (status: boolean) => {
        // doing optimistic update
        setApprovalsStatus(status);
        if (typeof toggleApprovalsApi === 'function') {
            toggleApprovalsApi(status)
                .then(() => {
                    sendMessageToParentWindow('refetch-account-refresh');
                })
                .catch(() => {
                    //  reverting value in case of failure
                    setApprovalsStatus(!status);
                });
        }
    };

    const value = {
        navigateInParentWindow: navigateTo,
        browserLocation,
        browserParams,
        smUsers,
        isMocked,
        enabled: isApprovalsEnabled,
        toggleApprovalInStore,
        domain,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useGlobalStore = () => {
    return useContext(StoreContext);
};
