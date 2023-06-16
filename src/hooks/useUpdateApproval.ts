import { IApprovalFlowUpdateFormBody } from '@gTypes/approvalCreate';
import { useMutation } from 'react-query';
import { createMockResponse, requestData } from '@helper/api';
import { IApproval } from '@gTypes/approvalList';
import { APPROVALS_LIST_TOKEN } from '@constants/admin';
import { showSnackbar } from '@components/CommonSnackBar';
import { appQueryClient } from '@queryClients/appQueryClient';
import { apiPaths } from '@constants/api';

let approvePromise: ((val: unknown) => void) | null;
let rejectPromise: ((val: unknown) => void) | null;

const updateApprovalApi = async (
    approvalFlowId: string,
    formData: IApprovalFlowUpdateFormBody,
    isMock = false
): Promise<null> => {
    if (isMock) {
        const data = await createMockResponse<null>(null);
        return data;
    }
    const data = await requestData<null>(apiPaths.adminPanel.updateApproval(approvalFlowId), 'PATCH', formData);
    return data;
};

export const useUpdateApproval = (approvalFlowId: string, smId: string, isMock: boolean) => {
    const mutation = useMutation(
        (formData: IApprovalFlowUpdateFormBody) => updateApprovalApi(approvalFlowId, formData, isMock),
        {
            onSettled: () => {
                approvePromise = null;
                rejectPromise = null;
            },
            onSuccess: (data, formData) => {
                appQueryClient.setQueryData([APPROVALS_LIST_TOKEN, smId], (oldData: IApproval[] | undefined) => {
                    const itemToChange = oldData?.find((item) => item.id == approvalFlowId);

                    // optimistic update in case of name change
                    if (formData.name && itemToChange) {
                        itemToChange.name = formData.name;
                    }

                    // optimistic update in case of archived
                    if (typeof formData.isActive !== 'undefined' && itemToChange) {
                        itemToChange.isActive = formData.isActive;
                    }

                    return oldData || [];
                });

                const postfix = formData.name ? 'name updated' : 'archived';

                showSnackbar({
                    message: `Approval Flow ${postfix}`,
                    type: 'info',
                    autoHideAfter: 2000,
                });
                approvePromise && approvePromise(data);
            },
            onError: (err) => {
                rejectPromise && rejectPromise(err);
                showSnackbar({
                    message: 'Failed to update the approval flow',
                    type: 'info',
                    autoHideAfter: 2000,
                });
            },
        }
    );

    const updateApproval = (data: IApprovalFlowUpdateFormBody) => {
        return new Promise((res, rej) => {
            approvePromise = res;
            rejectPromise = rej;
            mutation.mutate(data);
        });
    };
    return {
        updateApproval,
        isUpdatingApproval: mutation.isLoading,
        isSuccess: mutation.isSuccess,
        isFailed: mutation.isError,
    };
};
