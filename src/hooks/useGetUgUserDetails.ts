import { useQuery } from 'react-query';
import { UG_USER_TOKEN } from '@constants/admin';
import { createMockResponse, requestData } from '@helper/api';
import { IUgUser } from '@gTypes/approvalList';
import { apiPaths } from '@constants/api';
import { appQueryOptions } from '@constants/queryClient';

const fakeData: IUgUser = {
    id: '2',
    email: 'deleted@gmail.com',
    firstname: 'deletd_abcd',
};

const fetchUgUserDetail = async (userId: string, isMock = false): Promise<IUgUser> => {
    if (isMock) {
        const data = await createMockResponse<IUgUser>(fakeData);
        return data;
    }
    const data = await requestData<IUgUser>(() => {
        return {
            apiPath: apiPaths.adminPanel.ugUserDetail(userId),
            isV2: true,
        };
    }, 'GET');
    return data;
};

export const useGetUgUserDetails = (userId: string, enabled: boolean, isMock: boolean) => {
    const { status, data, error, isRefetching } = useQuery<IUgUser, Error>(
        [UG_USER_TOKEN, userId],
        () => fetchUgUserDetail(userId, isMock),
        { enabled, retry: false, ...appQueryOptions, staleTime: Infinity }
    );
    return {
        status,
        data,
        error,
        isRefetching,
    };
};
