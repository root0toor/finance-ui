import { useQuery } from 'react-query';
import { APPROVALS_LIST_TOKEN } from '@constants/admin';
import { createMockResponse, requestData } from '@helper/api';
import { IApproval, ApprovalListDataType } from '@gTypes/approvalList';
import { apiPaths } from '@constants/api';
import { appQueryOptions } from '@constants/queryClient';

const fakeData: ApprovalListDataType = {
    data: [
        {
            id: '1',
            usergroupId: '1',
            name: 'expense',
            createdBy: '1',
            isActive: true,
            steps: [
                {
                    stepId: '1',
                    stepApprovers: [
                        {
                            id: '1',
                            type: 'COLLABORATOR',
                        },
                        {
                            id: '2',
                            type: 'COLLABORATOR',
                        },
                    ],
                },
                {
                    stepId: '2',
                    stepApprovers: [
                        {
                            id: '1',
                            type: 'COLLABORATOR',
                        },
                        {
                            id: '1',
                            type: 'SM_USER',
                        },
                    ],
                },
            ],
        },
        {
            id: '2',
            usergroupId: '3',
            name: 'Reimbursement Expense',
            createdBy: '2',
            isActive: false,
            steps: [
                {
                    stepId: '1',
                    stepApprovers: [
                        {
                            id: '1',
                            type: 'COLLABORATOR',
                        },
                        {
                            id: '2',
                            type: 'COLLABORATOR',
                        },
                    ],
                },
                {
                    stepId: '2',
                    stepApprovers: [
                        {
                            id: '1',
                            type: 'COLLABORATOR',
                        },
                        {
                            id: '2',
                            type: 'COLLABORATOR',
                        },
                    ],
                },
            ],
        },
    ],
};

const fetchApprovalsList = async (smId: string, isMock = false): Promise<IApproval[]> => {
    if (isMock) {
        const data = await createMockResponse<ApprovalListDataType>(fakeData);
        return data.data;
    }
    const data = await requestData<ApprovalListDataType>(apiPaths.adminPanel.approvalList(smId), 'GET');
    return data.data;
};

export const useGetSmApprovalsList = (smId: string, enabled: boolean, isMock: boolean) => {
    const { status, data, error, isRefetching } = useQuery<IApproval[], Error>(
        [APPROVALS_LIST_TOKEN, smId],
        () => fetchApprovalsList(smId, isMock),
        { enabled, retry: false, ...appQueryOptions }
    );
    return {
        status,
        data,
        error,
        isRefetching,
    };
};
