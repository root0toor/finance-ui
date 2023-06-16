import React from 'react';
import { fetch } from 'cross-fetch';
import 'cross-fetch/polyfill';
import { render, screen } from '@testing-library/react';
import { setAppConfig } from '@helper/api';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { createServer, MockServerHandler } from '@server/index';
import { ApprovalListDataType, IApproval } from '@gTypes/approvalList';
import { apiPaths } from '@constants/api';
import { describe, it, vi } from 'vitest';
import {
    IApprovalProcessFormData,
    IApprovalRequestApiResponse,
    TApprovalProcessFormStatus,
    TApprovalStatus,
} from '@gTypes/applyApproval';
import { ApprovalSelectionConfiguration } from '@pages/ExtensionFlow';
import { showSnackbar } from '@components/CommonSnackBar';
import { appQueryClient } from '@queryClients/appQueryClient';
import { APPROVAL_REQUEST_DETAILS } from '@constants/extension';

let processData: IApprovalProcessFormData | null;
vi.mock('@hooks/useProcessApprovalRequest', () => {
    return {
        useProcessApprovalRequest: () => ({
            processApprovalRequest: (data: IApprovalProcessFormData) => {
                processData = data;
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
                return new Promise((res) => {
                    const message = getSnackbarMessage(data.status);
                    showSnackbar({
                        message,
                        type: 'info',
                        autoHideAfter: 2000,
                    });
                    res('success');
                });
            },
        }),
    };
});

global.fetch = fetch;
export const baseUrl = 'https://www.hiverhq.com';
const v2Url = 'https://v2.hiver.com';
setAppConfig(v2Url, baseUrl, 'extension');

const approvalListFakeData: IApproval[] = [
    {
        id: '1',
        usergroupId: '1',
        name: 'Engg. Expense',
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
                ],
            },
        ],
    },

    {
        id: '2',
        usergroupId: '1',
        name: 'Archived Expense',
        createdBy: '1',
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
                ],
            },
        ],
    },
];

const fakeApprovalRequestData: IApprovalRequestApiResponse = {
    data: {
        approvalRequestId: 2,
        approvalFlowId: 1,
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
                statusDetails: 'abcd_gmail.com, efgh@gmail.com, cc@gmail.com',
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
                statusDetails: 'abcd_gmail.com, efgh@gmail.com, cc@gmail.com',
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

const handlers: MockServerHandler[] = [
    {
        path: `${apiPaths.common.getToken()}?usersession=1`,
        method: 'get',
        response: {
            token: 'token_adhbwehbfwkhje',
        },
    },

    {
        path: apiPaths.extension.createApprovalRequest(),
        method: 'post',
        response: {
            data: { id: '1' },
        },
    },
    {
        path: apiPaths.extension.approvalRequestDetails('1', '1'),
        method: 'get',
        response: fakeApprovalRequestData,
    },
    {
        path: apiPaths.adminPanel.approvalList('1'),
        method: 'get',
        response: {
            data: approvalListFakeData,
        } as ApprovalListDataType,
    },

    {
        path: apiPaths.extension.processApprovalRequest(),
        method: 'post',
        response: {
            data: {
                id: '1',
            },
        },
    },
];

const closeInfoPopper = vi.fn();
const selectionProps = {
    conversationId: '1',
    smId: '1',
    moduleDisabled: false,
    userId: '1',
    closeInfoPopper,
};

const testOpeneningOfModal = async () => {
    const cancelAprrovalBtn = await screen.findByTestId('approval_select_cancel_btn');
    userEvent.click(cancelAprrovalBtn);
    screen.getByRole('presentation');
    screen.getByText(/Cancel Approval Request?/i);
    screen.getByRole('button', { description: /confirm/i });
};

const testOpeningResponseSection = async () => {
    const rejectBtn = await screen.findByTitle('reject');
    await userEvent.click(rejectBtn);
};
const testCancellingOfApproval = async () => {
    const confirmBtn = screen.getByRole('button', { description: /confirm/i });
    await userEvent.click(confirmBtn);
    expect(processData?.status).toBe('CANCELLED');
    await screen.findByRole('button', { name: /Select approval/i });
    await screen.findByText(/Approval request cancelled/i);
    expect(screen.queryByTitle('approve')).not.toBeInTheDocument();
    expect(screen.queryByTitle('reject')).not.toBeInTheDocument();
};

describe('Testing approval selection flow', () => {
    const { server, removeListners } = createServer(v2Url, baseUrl, handlers, true);

    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
        removeListners();
    });

    beforeEach(() => {
        render(
            <React.StrictMode>
                <ApprovalSelectionConfiguration {...selectionProps} />
            </React.StrictMode>
        );
    });

    it('should contain a headind named approval', () => {
        screen.getByRole('heading', { name: /Approval/i });
    });

    it('should show a status badge if present', async () => {
        const { status = '' } = fakeApprovalRequestData.data ? fakeApprovalRequestData.data : {};
        switch (status) {
            case 'APPROVED':
                await screen.findByTitle(/approved/i);
                break;
            case 'PENDING':
                await screen.findByTitle(/pending/i);
                break;
            case 'REJECTED':
                await screen.findByTitle(/rejected/i);
                break;
            default:
                expect(await screen.findByTitle(status)).not.toBeInTheDocument();
                break;
        }
    });

    it('should show response buttons in case if the user is able to give response', async () => {
        if (fakeApprovalRequestData.data) {
            if (fakeApprovalRequestData.data.approvalFlowId) {
                const approval = approvalListFakeData.find(
                    (item) =>
                        item.id ===
                        String(fakeApprovalRequestData.data ? fakeApprovalRequestData.data.approvalFlowId : '')
                );
                await screen.findByRole('button', { name: approval?.name });
                const approvalStates: TApprovalStatus[] = ['APPROVED', 'REJECTED', 'CANCELLED'];

                if (selectionProps.moduleDisabled || approvalStates.includes(fakeApprovalRequestData.data.status)) {
                    expect(screen.queryByTitle('approve')).not.toBeInTheDocument();
                    expect(screen.queryByTitle('reject')).not.toBeInTheDocument();
                } else {
                    screen.queryByTitle('approve');
                    screen.queryByTitle('reject');
                }
            } else {
                await screen.findByRole('button', { name: /Select approval/i });
                expect(screen.queryByTitle('approve')).not.toBeInTheDocument();
                expect(screen.queryByTitle('reject')).not.toBeInTheDocument();
            }
        }
    });

    it('should  display cancel button when the approval request is not in approved state', async () => {
        if (fakeApprovalRequestData.data?.status !== 'APPROVED') {
            await screen.findByTestId('approval_select_cancel_btn');
        } else {
            expect(screen.queryByTestId('approval_select_cancel_btn')).not.toBeInTheDocument();
        }
    });

    it('should call the processrequestDetails api with proper data when approved', async () => {
        const approveBtn = await screen.findByTitle('approve');
        await userEvent.click(approveBtn);
        expect(processData?.status).toBe('APPROVED');
        await screen.findByText(/Approval request approved/i);
    });

    it('should show the exact number of steps coming from server', async () => {
        if (fakeApprovalRequestData.data) {
            const steps = await screen.findAllByRole('listitem');
            expect(steps.length === fakeApprovalRequestData.data.approvalRequestDetails.length).toBeTruthy();
        }
    });

    it('should show response accumulation section when clicked on reject button', async () => {
        await testOpeningResponseSection();
        screen.getByLabelText(/Reason for rejecting/i);
        const options = screen.getAllByRole('radio') as HTMLInputElement[];
        const values = ['Inaccurate', 'Other', 'Duplicate'];
        options.forEach((option) => {
            expect(values.includes(option.value)).toBeTruthy();
        });
        screen.getByText(/duplicate/i);
        screen.getByText(/Inaccurate/i);
        screen.getByText(/other/i);
        screen.getByPlaceholderText(/Additional Notes \(Optional\)/i);
        screen.getByRole('button', { name: /submit/i });
        screen.getByRole('button', { name: /^cancel$/i });
    });

    it('by default the other option should be checked and upon clicking on submit button it should call the api with poper data', async () => {
        await testOpeningResponseSection();
        const options = screen.getAllByRole('radio') as HTMLInputElement[];
        const otherRadioOption = options.find((item) => item.value === 'Other');
        if (otherRadioOption) {
            expect(otherRadioOption).toBeChecked();
        }

        const notesArea = screen.getByPlaceholderText(/Additional Notes \(Optional\)/i);
        const reason = 'not aware';
        await userEvent.type(notesArea, reason);
        const submitBtn = screen.getByRole('button', { name: /submit/i });
        await userEvent.click(submitBtn);
        await screen.findByText(/Approval request rejected/i);

        expect(processData?.status).toBe('REJECTED');
        expect(processData?.reason).toBe('Other');
        expect(processData?.note).toBe(reason);
    });

    it('should revert back to original state when clicked on cancel button', async () => {
        await testOpeningResponseSection();
        const cancelBtn = screen.getByRole('button', { name: /^cancel$/i });
        await userEvent.click(cancelBtn);
        screen.getByTitle('approve');
        screen.getByTitle('reject');
    });

    it('should show a confirm modal when clicked on cancel approval button', async () => {
        await testOpeneningOfModal();
    });

    it('should close the modal on clicking of cross icon on modal', async () => {
        await testOpeneningOfModal();
        const crossBtn = screen.getByTestId('confirm_cross_btn');
        userEvent.click(crossBtn);
        expect(screen.queryByRole('presentation')).toBeNull();
    });

    it('should clear the  ongoing approval request', async () => {
        await testOpeneningOfModal();
        await testCancellingOfApproval();
    });

    it('user should not be able to see archived approvals in dropdown list', async () => {
        await testOpeneningOfModal();
        await testCancellingOfApproval();
        const selectField = await screen.findByRole('button', { name: /Select approval/i });
        userEvent.click(selectField);
        const options = screen.getAllByRole('option');
        const archivedOption = options.find((option) => option.textContent === approvalListFakeData[1].name);
        expect(archivedOption).not.toBeDefined();
    });

    it('user should be able to select new approval after cancellation', async () => {
        await testOpeneningOfModal();
        await testCancellingOfApproval();
        const selectField = await screen.findByRole('button', { name: /Select approval/i });
        userEvent.click(selectField);
        const options = screen.getAllByRole('option');
        const firstOptionName = options[0].textContent;
        userEvent.click(options[0]);
        await screen.findByRole('button', { name: firstOptionName || '' });
        await screen.findByText(/Approval request initiated/i);
    });
});

describe('testing onboard guiders when showInfoPopper is passed as true ', () => {
    const { server, removeListners } = createServer(v2Url, baseUrl, handlers, true);

    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
        removeListners();
    });

    it('should show a guider when showInfoPopper is passed', async () => {
        render(<ApprovalSelectionConfiguration {...selectionProps} showInfoPopper={true} />);
        await screen.findByTitle(/pending/i);
        await screen.findByRole('presentation', { description: /Now request Approvals on conversations/i });
        const okayBtn = await screen.findByRole('button', { name: /okay/i });
        userEvent.click(okayBtn);
        expect(closeInfoPopper).toBeCalled();
    });
});

describe('testing onboard guiders when showInfoPopper is passed as true ', () => {
    const newFakedata = {
        data: {
            ...fakeApprovalRequestData.data,
            status: 'APPROVED',
        },
    };
    appQueryClient.removeQueries(APPROVAL_REQUEST_DETAILS);
    const newHandlers = [...handlers];
    newHandlers[2] = { ...newHandlers[2], response: newFakedata };

    const { server, removeListners } = createServer(v2Url, baseUrl, newHandlers, true);

    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
        removeListners();
    });
    afterEach(() => {
        server.resetHandlers();
    });

    it('should show info bar when approval in in approved, rejected or cancelled state', async () => {
        render(<ApprovalSelectionConfiguration {...selectionProps} conversationId="2" />);
        await screen.findByTitle(/approved/i);
        await screen.findByRole('alert', { description: fakeApprovalRequestData.data?.statusDetails || '' });
    });
});
