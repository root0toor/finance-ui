import { useMutation } from 'react-query';
import { createMockResponse, requestData } from '@helper/api';
import { IApprovalProcessFormData, TApprovalProcessFormStatus } from '@gTypes/applyApproval';
import { showSnackbar } from '@components/CommonSnackBar';
import { useState } from 'react';
import { apiPaths } from '@constants/api';

type successResponse = {
    data: {
        id: string;
    };
};

const fakeData = {
    data: {
        id: '1',
    },
};

let promiseResolver: (value: 'success' | 'failed') => void;
let promiseRejecter: (value: 'success' | 'failed') => void;

const processApprovalRequestApi = async (
    formData: IApprovalProcessFormData,
    isMock = false
): Promise<successResponse> => {
    if (isMock) {
        const data = await createMockResponse<successResponse>(fakeData);
        return data;
    }
    const data = await requestData<successResponse>(apiPaths.extension.processApprovalRequest(), 'POST', formData);
    return data;
};

const getSnackbarMessage = (status: TApprovalProcessFormStatus) => {
    switch (status) {
        case 'APPROVED':
            return 'Approval request approved';
        case 'REJECTED':
            return 'Approval request rejected';
        case 'CANCELLED':
            return 'Approval request cancelled';
        default:
            return 'Approval request submitted';
    }
};

export const useProcessApprovalRequest = (isMock: boolean, onSetteled: (status: 'success' | 'failed') => void) => {
    const [currentState, updateState] = useState<TApprovalProcessFormStatus | ''>('');
    const mutation = useMutation((formData: IApprovalProcessFormData) => processApprovalRequestApi(formData, isMock), {
        onSuccess: (data, formData) => {
            showSnackbar({
                message: getSnackbarMessage(formData.status),
                type: 'info',
                autoHideAfter: 2000,
            });
            onSetteled('success');
            promiseResolver('success');
        },
        onError: () => {
            showSnackbar({
                message: 'Failed to process approval request.',
                type: 'info',
                autoHideAfter: 3000,
            });
            onSetteled('failed');
            promiseRejecter('failed');
        },
        onSettled: () => {
            updateState('');
        },
    });

    const processApprovalRequest = (data: IApprovalProcessFormData): Promise<'success' | 'failed'> => {
        return new Promise((res, rej) => {
            promiseResolver = res;
            promiseRejecter = rej;
            updateState(data.status);
            mutation.mutate(data);
        });
    };

    return {
        processApprovalRequest,
        isProcessingApprovalRequest: mutation.isLoading,
        isSuccess: mutation.isSuccess,
        isFailed: mutation.isError,
        currentApprovalProcessType: currentState,
    };
};
