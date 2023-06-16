import { useState } from 'react';
import { useQuery } from 'react-query';
import { createMockResponse, requestData } from '@helper/api';
import { APPROVAL_REQUEST_DETAILS } from '@constants/extension';
import { IApprovalRequest, IApprovalRequestApiResponse } from '@gTypes/applyApproval';
import { apiPaths } from '@constants/api';
import { appQueryOptions } from '@constants/queryClient';

const fakeData: IApprovalRequestApiResponse = {
    data: {
        approvalRequestId: 2,
        approvalFlowId: 2,
        isApprover: true,
        currentStepId: 2,
        status: 'PENDING',
        statusDetails: 'Approval step was completed by Niraj. No action needed from you',
        approvalRequestDetails: [
            {
                id: 1,
                statusDetails: 'Process initiated',
                approvalRequestId: 2,
                stepId: 1,
                status: 'INITIATED',
                reason: '',
                note: '',
                updatedAt: '26th,Jan',
                isCancelled: false,
            },

            {
                id: 2,
                statusDetails: 'process approved',
                approvalRequestId: 2,
                stepId: 2,
                status: 'APPROVED',
                reason: '',
                note: '',
                updatedAt: '27th,Jan',
                isCancelled: false,
            },
            {
                id: 3,
                statusDetails: `Rejected by you on Mon, 5 Dec 2022. <br/> Reason - Duplicate <br/> Notes - The submitted doc is a duplicate`,
                approvalRequestId: 2,
                stepId: 3,
                status: 'IDLE',
                reason: '',
                note: '',
                updatedAt: '26th,Jan',
                isCancelled: false,
            },

            {
                id: 4,
                statusDetails: 'abcd_gmail.com, efgh@gmail.com, cc@gmail.com',
                approvalRequestId: 2,
                stepId: 4,
                status: 'IDLE',
                reason: '',
                note: '',
                updatedAt: '26th,Jan',
                isCancelled: false,
            },

            {
                id: 5,
                statusDetails: 'abcd_gmail.com <br/> efgh@gmail.com <br/> cc@gmail.com',
                approvalRequestId: 2,
                stepId: 5,
                status: 'IDLE',
                reason: '',
                note: '',
                updatedAt: '26th,Jan',
                isCancelled: false,
            },

            {
                id: 6,
                statusDetails: 'rejected due to method',
                approvalRequestId: 2,
                stepId: 6,
                status: 'REJECTED',
                reason: '',
                note: '',
                updatedAt: '26th,Jan',
                isCancelled: false,
            },
        ],
    },
};

const fetchApprovalsRequestDetails = async (
    conversationId: string,
    smId: string,
    isMock = false
): Promise<IApprovalRequest | null> => {
    if (isMock) {
        const data = await createMockResponse<IApprovalRequestApiResponse>(fakeData);
        return data.data;
    }
    const data = await requestData<IApprovalRequestApiResponse>((config) => {
        const queryParam = config.isCollaborator ? '&source=collab_space' : '';
        return {
            apiPath: `${apiPaths.extension.approvalRequestDetails(conversationId, smId)}${queryParam}`,
        };
    }, 'GET');
    return data.data;
};

export const useGetApprovalRequestDetails = (conversationId: string, smId: string, isMock: boolean) => {
    const [isRefetchingManually, setRefetchStatus] = useState(false);
    const { status, data, error, refetch } = useQuery<IApprovalRequest | null, Error>(
        [APPROVAL_REQUEST_DETAILS, smId, conversationId],
        () => fetchApprovalsRequestDetails(conversationId, smId, isMock),
        { retry: false, ...appQueryOptions }
    );

    const toggleMannualRefetchStatus = () => {
        setRefetchStatus((val) => !val);
    };

    const refetchDataManually = () => {
        toggleMannualRefetchStatus();
        return refetch().finally(() => {
            toggleMannualRefetchStatus();
        });
    };
    return {
        isRefetching: isRefetchingManually,
        status,
        data,
        error,
        refetch: refetchDataManually,
    };
};
