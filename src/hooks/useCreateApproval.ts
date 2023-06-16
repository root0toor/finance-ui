import { IApprovalFormBody } from '@gTypes/approvalCreate';
import { useMutation } from 'react-query';
import { createMockResponse, requestData } from '@helper/api';
import { IApproval } from '@gTypes/approvalList';
import { APPROVALS_LIST_TOKEN, APPROVERS_LIST_TOKEN } from '@constants/admin';
import { showSnackbar } from '@components/CommonSnackBar';
import { appQueryClient } from '@queryClients/appQueryClient';
import { apiPaths } from '@constants/api';
import { sendGainsightEvent } from '@helper/gainsight';

let hasFetchStarted = false;

type ApprovalDataType = {
    data: IApproval;
};

const fakeData: ApprovalDataType = {
    data: {
        id: '3',
        name: 'Engg 2',
        createdBy: 'Mark ava',
        usergroupId: '2',
        isActive: true,
        steps: [
            {
                stepId: '1',
                stepApprovers: [
                    {
                        id: '2',
                        type: 'COLLABORATOR',
                    },
                ],
            },
        ],
    },
};

const createApprovalApi = async (formData: IApprovalFormBody, isMock = false): Promise<IApproval> => {
    if (isMock) {
        const data = await createMockResponse<ApprovalDataType>(fakeData);
        return data.data;
    }
    const data = await requestData<ApprovalDataType>(apiPaths.adminPanel.createApproval(), 'POST', formData);
    return data.data;
};

export const useCreateApproval = (isMock: boolean) => {
    const mutation = useMutation((formData: IApprovalFormBody) => createApprovalApi(formData, isMock), {
        onMutate: () => {
            hasFetchStarted = true;
        },
        onSettled: () => {
            hasFetchStarted = false;
        },
        onError: () => {
            showSnackbar({
                message: 'Failed to create approval',
                type: 'info',
                autoHideAfter: 2000,
            });
        },
        onSuccess: (data, formData) => {
            appQueryClient.setQueryData([APPROVALS_LIST_TOKEN, formData.smId], (oldData: IApproval[] | undefined) => {
                return [data, ...(oldData || [])];
            });
            appQueryClient.invalidateQueries([APPROVERS_LIST_TOKEN, formData.smId]);
            showSnackbar({
                message: 'Approval Flow created',
                type: 'info',
                autoHideAfter: 2000,
            });
            sendGainsightEvent('approvalFlowCreated');
        },
    });

    const createApproval = (data: IApprovalFormBody) => {
        if (hasFetchStarted) {
            return;
        }
        mutation.mutate(data);
    };
    return {
        createApproval,
        isCreatingApproval: mutation.isLoading,
        isSuccess: mutation.isSuccess,
        isFailed: mutation.isError,
    };
};
