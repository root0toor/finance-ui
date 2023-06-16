import { useMutation } from 'react-query';
import { createMockResponse, requestData } from '@helper/api';
import { IApprovalRequestFormData } from '@gTypes/applyApproval';
import { showSnackbar } from '@components/CommonSnackBar';
import { sendGainsightEvent } from '@helper/gainsight';

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

const createApprovalRequestApi = async (
    formData: IApprovalRequestFormData,
    isMock = false
): Promise<successResponse> => {
    if (isMock) {
        const data = await createMockResponse<successResponse>(fakeData);
        return data;
    }
    const data = await requestData<successResponse>(`/approvals/approvalrequest/create`, 'POST', formData);
    return data;
};

export const useCreateApprovalRequest = (isMock: boolean, onSetteled: (status: 'success' | 'failed') => void) => {
    const mutation = useMutation((formData: IApprovalRequestFormData) => createApprovalRequestApi(formData, isMock), {
        onSuccess: () => {
            showSnackbar({
                message: 'Approval request initiated',
                type: 'info',
                autoHideAfter: 2000,
            });
            onSetteled('success');
            sendGainsightEvent('approvalRequested');
        },
        onError: () => {
            showSnackbar({
                message: 'Failed to create approval request.',
                type: 'info',
                autoHideAfter: 3000,
            });
            onSetteled('failed');
        },
    });

    const createApprovalRequest = (data: IApprovalRequestFormData) => {
        mutation.mutate(data);
    };

    return {
        createApprovalRequest,
        isCreatingApprovalRequest: mutation.isLoading,
        isSuccess: mutation.isSuccess,
        isFailed: mutation.isError,
    };
};
