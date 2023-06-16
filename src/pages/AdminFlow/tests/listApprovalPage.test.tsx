import React from 'react';
import { fetch } from 'cross-fetch';
import 'cross-fetch/polyfill';
import { apiPaths } from '@constants/api';
import { ApprovalListDataType, ApproverListDataType, IApproval, IApprover, IUgUser } from '@gTypes/approvalList';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { setAppConfig } from '@helper/api';
import { createServer, MockServerHandler } from '@server/index';

import { ApprovalsConfigurationPanel } from '@pages/AdminFlow';
import { getStepApproversName } from '@pages/AdminFlow/utils';

const fakeUgUserData = {
    id: '12',
    email: 'deleted@gmail.com',
    name: 'deletd_abcd',
};

const getUgUserDetailAPi = vi.fn().mockImplementation((userId) => {
    return { ...fakeUgUserData, id: userId };
});

vi.mock('@hooks/useGetUgUserDetails', () => {
    return {
        useGetUgUserDetails: (userId: string, enabled: boolean) => {
            if (enabled) {
                getUgUserDetailAPi(userId);
            }
            return {
                data: undefined,
            };
        },
    };
});

global.fetch = fetch;

const baseUrl = 'https://www.hiverhq.com';
const v2Url = 'https://v2.hiver.com';

setAppConfig(v2Url, baseUrl, 'admin_panel');

const smUsers = [
    {
        email: 'avatar@gmail.com',
        userid: '10',
        firstname: 'user',
        lastname: '',
    },
    {
        email: 'morvee@gmail.com',
        userid: '14',
        firstname: 'morvee',
        lastname: '',
    },
];

const getSMUsers = () => {
    return smUsers.map((item) => ({ ...item, id: item.userid, type: 'SM_USER' } as IApprover));
};

const approversFakeList: IApprover[] = [
    {
        id: '1',
        email: 'abcd@gmail.com',
        type: 'COLLABORATOR',
    },
    {
        id: '2',
        email: 'efgh@gmail.com',
        type: 'COLLABORATOR',
    },
    ...getSMUsers(),
];

const approvalListFakeData: IApproval[] = [
    {
        id: '1',
        usergroupId: '1',
        name: 'expense',
        createdBy: '10',
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
                        id: '14',
                        type: 'SM_USER',
                    },
                ],
            },
        ],
    },

    {
        id: '2',
        usergroupId: '1',
        name: 'Deleted user approval',
        createdBy: '12',
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
                        id: '14',
                        type: 'SM_USER',
                    },
                ],
            },
        ],
    },

    {
        id: '3',
        usergroupId: '1',
        name: 'finance',
        createdBy: '12',
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
                        id: '14',
                        type: 'SM_USER',
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
    {
        path: apiPaths.adminPanel.ugUserDetail('2'),
        method: 'get',
        response: fakeUgUserData as IUgUser,
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

const testExistenceOfAllNamesPresentInList = async () => {
    for (const data of approvalListFakeData) {
        await screen.findByText(data.name);
    }
};

const testExistenceOfAllCreatedAtPresentInList = async (createdBy: string) => {
    const userEmail = approversFakeList.find((item) => {
        const isSmUser = item.type === 'SM_USER';
        return isSmUser && item.id == createdBy;
    });
    await screen.findByText(`created by ${userEmail?.firstname || userEmail?.email || 'Deleted User'}`, {
        collapseWhitespace: true,
        exact: false,
    });
};
describe('Testing approval list page', async () => {
    let isApprovalsEnabled = true;

    const toggleApprovalsFunc = vi.fn().mockImplementation((status) => {
        return new Promise((res) => {
            isApprovalsEnabled = status;
            res(status);
        });
    });

    const getElement = () => {
        return (
            <React.StrictMode>
                <ApprovalsConfigurationPanel
                    userId="1"
                    smUsers={smUsers}
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
                    enabled={isApprovalsEnabled}
                    toggleApprovals={toggleApprovalsFunc}
                    domain="hiver.space"
                />
            </React.StrictMode>
        );
    };

    beforeEach(() => {
        isApprovalsEnabled = true;
        render(getElement());
    });

    it('should contain an approvals heading', () => {
        screen.getByText('Approvals');
    });

    it('should contain an create approval button', () => {
        screen.getByRole('button', { name: /Create Approval Flow/i });
    });

    /**
     * Used for testing emptiness of approval list
     */

    // it('should show empty page if no data is present', async () => {
    //     awai(() => {
    //         screen.getByText(/No Approval Flow Created/i);
    //     })
    //     server.use(createMockedApi(`${baseUrl}${apiPaths.adminPanel.approvalList}`, 'get', approvalListFakeData));
    //     container.rerender(getElement());
    // })

    it('should show the list with the approval list names', async () => {
        await testExistenceOfAllNamesPresentInList();
    });

    it('should open detail mode when clicked on the approval and should have all the details in it', async () => {
        const data = approvalListFakeData[0];
        await userEvent.click(screen.getByTestId(`approval_heading_${data.id}`));
        await testExistenceOfAllCreatedAtPresentInList(data.createdBy);
        let i = 0;
        for (const step of data.steps) {
            screen.getByText(`Step ${i + 1}`);
            const emails = getStepApproversName(step.stepApprovers, approversFakeList);
            await screen.findByText(emails, { exact: true });
            i++;
        }
    });

    it('should navigate to create approval page on click of create approval flow btn', async () => {
        await userEvent.click(screen.getByRole('button', { name: /Create Approval Flow/i }));
        screen.getByRole('heading', { name: /Create Approval Flow/i });
    });

    it('should open edit mode when clicked on the pencil icon', async () => {
        const editIcon = screen.getByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        screen.getByDisplayValue(approvalListFakeData[0].name);
        expect(screen.getByTitle(/update approval/i)).toBeDisabled();
        screen.getByTitle(/cancel edit/i);
    });

    it('should close edit mode when clicked on the close icon in edit mode', async () => {
        const editIcon = screen.getByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        const closeBtn = screen.getByTitle(/cancel edit/i);
        await userEvent.click(closeBtn);
        await testExistenceOfAllNamesPresentInList();
    });

    it('should thow error when try to save with the same name', async () => {
        const editIcon = screen.getByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        const input = screen.getByDisplayValue(approvalListFakeData[0].name);
        await userEvent.type(input, ' ');
        screen.getByText(/An Approval Flow with this name already exists/i);
        expect(screen.getByTitle(/update approval/i)).toBeDisabled();
    });

    it('should thow error when try to save with empty field', async () => {
        const editIcon = screen.getByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        const input = screen.getByDisplayValue(approvalListFakeData[0].name);
        await userEvent.clear(input);
        screen.getByText(/Approval flow name is required/i);
        expect(screen.getByTitle(/update approval/i)).toBeDisabled();
    });

    it('should thow character limit error when try to save with name with more than 30 characters', async () => {
        const editIcon = screen.getByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        const input = screen.getByDisplayValue(approvalListFakeData[0].name);
        await userEvent.type(input, 'aksbnfkjafkjnakjfnalfnlanfwefpwefmownfvjwnvownvownwneowefpwejfwepfokwpefjwep ');
        screen.getByText(/Character limit for Approval Flow names is 30/i);
        expect(screen.getByTitle(/update approval/i)).toBeDisabled();
    });

    it('should update the name with if a valid name is entered', async () => {
        const editIcon = screen.getByTestId(`edit_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(editIcon);
        const input = screen.getByDisplayValue(approvalListFakeData[0].name);
        await userEvent.type(input, '2'); // will get concatenaed with the existing name
        const updatebtn = screen.getByTitle(/update approval/i);
        expect(updatebtn).not.toBeDisabled();
        await userEvent.click(updatebtn);
        await screen.findByText(`${approvalListFakeData[0].name}2`);
        approvalListFakeData[0].name = `${approvalListFakeData[0].name}2`;
    });

    it('should display a checkbox to toggle approval flow', () => {
        const toggleBtn = screen.getByRole('checkbox');
        if (isApprovalsEnabled) {
            expect(toggleBtn).toBeChecked;
        } else {
            expect(toggleBtn).not.toBeChecked;
        }
    });

    it('should call the parent toggle api when tried to toggle the approval', async () => {
        const toggleBtn = screen.getByRole('checkbox');
        const nextStatus = !isApprovalsEnabled;
        await userEvent.click(toggleBtn);
        expect(toggleApprovalsFunc).toBeCalled();
        expect(toggleApprovalsFunc).toBeCalledWith(nextStatus);
    });
    it('should create a blocker on the list when the approvals is toggeled off', async () => {
        const toggleBtn = screen.getByRole('checkbox');
        // toggling off
        await userEvent.click(toggleBtn);
        const createBtn = screen.getByRole('button', { name: /Create Approval Flow/i });
        expect(createBtn).toBeDisabled();
        const approvalsList = screen.getByRole('list');
        try {
            // would not be able to click on the approvals list
            await userEvent.click(approvalsList);
        } catch (err) {
            expect(err).not.toBeNull();
        }
    });

    it('should call get uguser details api when a user is not found in the list', async () => {
        await userEvent.click(screen.getByTestId(`approval_heading_${approvalListFakeData[1].id}`));
        expect(getUgUserDetailAPi).toBeCalled();
    });

    it('should show archived badge for archived approval flow', async () => {
        await testExistenceOfAllNamesPresentInList();
        const archivedFlow = approvalListFakeData.find((item) => !item.isActive);
        if (archivedFlow) {
            screen.getByTitle(/archive_chip/i);
        }
    });

    it('should not able to edit the approval flow when archived ', async () => {
        await testExistenceOfAllNamesPresentInList();
        const archivedFlow = approvalListFakeData.find((item) => !item.isActive);
        if (archivedFlow) {
            screen.getByText(/archived/i);
            const editIcon = screen.queryByTestId(`edit_btn_${archivedFlow.name}`);
            expect(editIcon).not.toBeInTheDocument();
        }
    });

    it('should  able to view detail mode of the approval flow in archived state', async () => {
        await testExistenceOfAllNamesPresentInList();
        const archivedFlow = approvalListFakeData.find((item) => !item.isActive);
        if (archivedFlow) {
            screen.getByText(/archived/i);
            await userEvent.click(screen.getByTestId(`approval_heading_${archivedFlow.id}`));
            await testExistenceOfAllCreatedAtPresentInList(archivedFlow.createdBy);
        }
    });

    it('should show confirm modal when clicked on archive btn', async () => {
        const archiveIcon = screen.getByTestId(`archive_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(archiveIcon);
        await screen.findByText(/Are you sure\?/i);
        await screen.findByText(/This action cannot be undone/i);
        await screen.getByRole('button', { name: /archive/i });
    });

    it('should archive the flow when archiving is confirmed', async () => {
        const archiveIcon = screen.getByTestId(`archive_btn_${approvalListFakeData[0].name}`);
        await userEvent.click(archiveIcon);
        await screen.findByText(/Are you sure\?/i);
        await screen.getByText(/This action cannot be undone/i);
        const archiveBtn = await screen.getByRole('button', { name: /archive/i });
        await act(() => {
            userEvent.click(archiveBtn);
        });
        const archivedApprovalItems = await screen.findAllByTitle(/archive_chip/i);
        expect(archivedApprovalItems.length).toBe(2);
    });
});
