import React from 'react';
import { fetch } from 'cross-fetch';
import 'cross-fetch/polyfill';
import { apiPaths } from '@constants/api';
import { ApprovalListDataType, ApproverListDataType } from '@gTypes/approvalList';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { setAppConfig } from '@helper/api';
import { createServer, MockServerHandler } from '@server/index';

import { ApprovalsConfigurationPanel } from '@pages/AdminFlow';
import { IApprovalFlowUpdateFormBody } from '@gTypes/approvalCreate';

let updateFormData: IApprovalFlowUpdateFormBody | null;

vi.mock('@hooks/useUpdateApproval', () => {
    return {
        useUpdateApproval: () => {
            return {
                updateApproval: vi.fn().mockImplementation((data) => {
                    updateFormData = data;
                    return new Promise((res) => {
                        res({});
                    });
                }),
                isUpdatingApproval: false,
                isSuccess: false,
                isFailed: false,
            };
        },
    };
});

global.fetch = fetch;

const baseUrl = 'https://www.hiverhq.com';
const v2Url = 'https://v2.hiver.com';
setAppConfig(v2Url, baseUrl, 'admin_panel');

const approversFakeList = [
    {
        id: '1',
        email: 'abcd@gmail.com',
    },
    {
        id: '2',
        email: 'efgh@gmail.com',
    },
];

const approvalListFakeData = [
    {
        id: '1',
        usergroupId: '1',
        name: 'expense',
        createdBy: 'John',
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
                ],
            },
        ],
    },
];

const handlers: MockServerHandler[] = [
    {
        path: apiPaths.common.getToken(),
        method: 'get',
        response: {
            token: 'token_adhbwehbfwkhje',
        },
    },
    {
        path: apiPaths.common.smApprovers('1'),
        method: 'post',
        response: {
            data: approversFakeList,
        } as ApproverListDataType,
    },
    {
        path: apiPaths.adminPanel.approvalList('1'),
        method: 'get',
        response: {
            data: approvalListFakeData,
        } as ApprovalListDataType,
    },
    {
        path: apiPaths.adminPanel.updateApproval('1'),
        method: 'patch',
        response: null,
    },
];

const { server, removeListners } = createServer(v2Url, baseUrl, handlers, true);

beforeAll(() => {
    server.listen();
});

afterAll(() => {
    server.close();
    removeListners();
});

describe('Testing approval list page', async () => {
    const getElement = () => {
        return (
            <React.StrictMode>
                <ApprovalsConfigurationPanel
                    userId="1"
                    smUsers={[]}
                    onNavigate={() => {
                        //TODO
                    }}
                    browserLocation={{
                        state: '',
                        key: '',
                        pathname: '',
                        search: '',
                        hash: '',
                    }}
                    browserParams={{
                        smid: '1',
                    }}
                    enabled={true}
                    toggleApprovals={(status: boolean) => {
                        return new Promise((res) => {
                            setTimeout(() => {
                                res(status);
                            }, 3000);
                        });
                    }}
                    domain="hiver.space"
                />
            </React.StrictMode>
        );
    };

    beforeEach(() => {
        render(getElement());
    });

    it('should call the update hook with proper data', async () => {
        const editIcon = await screen.findByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        const input = await screen.findByDisplayValue(approvalListFakeData[0].name);
        await userEvent.type(input, '2'); // will get concatenaed with the existing name
        const updatebtn = screen.getByTitle(/update approval/i);
        expect(updatebtn).not.toBeDisabled();
        await userEvent.click(updatebtn);
        expect(updateFormData?.name).toBe(`${approvalListFakeData[0].name}2`);
    });
});
