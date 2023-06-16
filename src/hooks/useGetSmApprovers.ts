import { useQuery } from 'react-query';
import { APPROVERS_LIST_TOKEN } from '@constants/admin';
import { createMockResponse, requestData } from '@helper/api';
import { IApprover, ICollaboratorApprover, ApproverListDataType } from '@gTypes/approvalList';
import { useGlobalStore } from '@pages/AdminFlow/storeContext';
import { apiPaths } from '@constants/api';
import { appQueryOptions } from '@constants/queryClient';

const fakeData: ApproverListDataType = {
    data: [
        {
            id: '1',
            email: `abcd@hiver.space`,
        },
        {
            id: '2',
            email: `mark@hiver.space`,
        },
        {
            id: '3',
            email: 'jarvis@gmail.com',
        },
    ],
};

const fetchApproversList = async (smId: string, isMock = false): Promise<ICollaboratorApprover[]> => {
    if (isMock) {
        const data = await createMockResponse<ApproverListDataType>(fakeData);
        return data.data;
    }
    const data = await requestData<ApproverListDataType>(apiPaths.common.smApprovers(smId), 'POST', {
        smIds: [smId],
    });
    return data.data;
};

export const useGetSmApprovers = (smId: string, isMock: boolean) => {
    const store = useGlobalStore();
    const { status, data, error } = useQuery<ICollaboratorApprover[], Error>(
        [APPROVERS_LIST_TOKEN, smId],
        () => fetchApproversList(smId, isMock),
        { retry: false, ...appQueryOptions }
    );
    const smUsers: IApprover[] | undefined = store?.smUsers.map((user) => ({
        ...user,
        id: `${user.userid}_sm`,
        type: 'SM_USER',
    }));
    const collaborators: IApprover[] | undefined = data?.map((item) => ({
        ...item,
        id: `${item.id}_collab`,
        type: 'COLLABORATOR',
    }));

    const totalUsers = smUsers && collaborators ? [...smUsers, ...collaborators] : undefined;

    return {
        status,
        data: totalUsers,
        error,
    };
};
