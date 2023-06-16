import React from 'react';
import 'cross-fetch/polyfill';
import { apiPaths } from '@constants/api';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { createServer, MockServerHandler } from '@server/index';
import { ApprovalListDataType, ApproverListDataType } from '@gTypes/approvalList';
import { CreateApprovalPage } from '@pages/AdminFlow/createApprovalPage';
import userEvent from '@testing-library/user-event';
import { IApprovalFormBody } from '@gTypes/approvalCreate';
import { render, screen, baseUrl, fakeStoreProps, v2Url } from './util';

let createData: IApprovalFormBody;

vi.mock('@hooks/useCreateApproval', () => {
    return {
        useCreateApproval: () => ({
            createApproval: vi.fn().mockImplementation((data) => {
                createData = data;
                return;
            }),
            isCreatingApproval: false,
            isSuccess: false,
            isFailed: false,
        }),
    };
});

const approversFakeList = [
    {
        id: '1',
        email: 'abcd@hiver.space',
    },
    {
        id: '2',
        email: 'efgh@hiver.space',
    },
    {
        id: '3',
        email: 'ijk@gmail.com',
    },
    {
        id: '4',
        email: 'lmno@hiver.space',
    },
];

const approvalListFakeData = [
    {
        id: '1',
        usergroupId: '1',
        name: 'expense',
        createdBy: '1',
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
];

const { server, removeListners } = createServer(v2Url, baseUrl, handlers, true);

beforeAll(() => {
    server.listen();
});

afterAll(() => {
    server.close();
    removeListners();
});

const getComboBox = async (stepNumber: number, approverNumber: number) => {
    const comboBoxes = await screen.findAllByRole('combobox');
    return comboBoxes.filter((item) => item.id === `approver_${stepNumber}_${approverNumber}`)[0];
};

const selectFirstOptionFromApproverList = async (stepNumber: number, approverNumber: number) => {
    const comboBox = await getComboBox(stepNumber, approverNumber);
    await userEvent.click(comboBox);

    const options = await screen.findAllByRole('option');
    const option = options[0];
    await userEvent.click(option);
};

const getCreateApprovalButton = () => {
    return screen.getByRole('button', { name: /Create Approval Flow/i });
};

describe('Testing create approval flow', () => {
    beforeEach(() => {
        render(<CreateApprovalPage />);
    });

    it('should contain a heading', () => {
        screen.getByRole('heading', { name: /Create Approval Flow/i });
    });

    it('should contain a back button', () => {
        screen.getByTestId('back_btn');
    });

    it('create btn should be disabled initially', () => {
        expect(getCreateApprovalButton()).toBeDisabled();
    });

    it('should contain a name field for the approval', () => {
        screen.getByText(/Flow name/i);
        const inputElems = screen.getAllByRole('textbox');
        const len = inputElems.filter((item) => item.id === 'flow_name').length;
        expect(len === 1).toBeTruthy();
    });

    it('should show an empty error message when name field is empty', async () => {
        const inputElems = screen.getAllByRole('textbox');
        const flowNameinput = inputElems.filter((item) => item.id === 'flow_name')[0];
        await userEvent.type(flowNameinput, 'abcd');
        await userEvent.clear(flowNameinput);
        screen.getByText(/Approval flow name is required/i);
        expect(getCreateApprovalButton()).toBeDisabled();
    });

    // it('should show an character upper limit error message when name field is above character limit', async () => {
    //     const inputElems = screen.getAllByRole('textbox');
    //     const flowNameinput = inputElems.filter((item) => item.id === 'flow_name')[0];
    //     await userEvent.type(
    //         flowNameinput,
    //         'ablanlnaldnalsndlaknsdlkandlkandjkbwefklbqfbqwflibweifbweifbwefbnwfbnwljfbnwlejfcd'
    //     );
    //     screen.getByText(/Character limit for Approval Flow names is 30/i);
    //     expect(getCreateApprovalButton()).toBeDisabled();
    // });

    it('should show an existing name error message when the name is already present', async () => {
        const inputElems = screen.getAllByRole('textbox');
        const flowNameinput = inputElems.filter((item) => item.id === 'flow_name')[0];
        await userEvent.type(flowNameinput, approvalListFakeData[0].name);
        await screen.findByText(/An Approval Flow with this name already exists/i);
        expect(getCreateApprovalButton()).toBeDisabled();
    });

    it('should initially show a single step Approver box with one empty combobox approver select field', () => {
        screen.getByText(/Step 1/i);
        screen.getByText(/Approver is/i);
        screen.getByRole('combobox');
    });

    it('should initially see an disabled OR button inside the first step', async () => {
        const btn = await screen.findByRole('button', { name: /_*OR/i });
        expect(btn).toBeDisabled();
    });

    it('should initially see an disabled add step button', async () => {
        const btn = await screen.findByRole('button', { description: /Add Step/i });
        expect(btn).toBeDisabled();
    });

    it('should show domain users in list when clicked on the first approver select field', async () => {
        const comboBox = screen.getByRole('combobox');
        await userEvent.click(comboBox);
        const options = await screen.findAllByRole('option');
        const domainUsers = fakeStoreProps.smUsers.filter((user) => user.email.endsWith(`@${fakeStoreProps.domain}`));
        const domainApprovers = approversFakeList.filter((approver) =>
            approver.email.endsWith(`@${fakeStoreProps.domain}`)
        );
        expect(options.length === domainApprovers.length + domainUsers.length).toBeTruthy();
    });

    it('should enable the create button if the name field and the approver field is filled with value', async () => {
        const inputElems = screen.getAllByRole('textbox');
        const flowNameInput = inputElems.filter((item) => item.id === 'flow_name')[0];
        userEvent.type(flowNameInput, 'My first flow');

        await selectFirstOptionFromApproverList(0, 0);

        const btn = screen.getByRole('button', { name: /Create Approval Flow/i });
        expect(btn).toBeEnabled();
    });

    it('should show an empty option text when no matching value is present', async () => {
        const comboBox = await getComboBox(0, 0);
        userEvent.type(comboBox, 'akshakbduanbdjkq andkjqbekd');
        screen.getByText(`No results. Invite approvers using @${fakeStoreProps.domain} email`);
    });

    it('should show an Invite option text when a valid domain email address is added', async () => {
        const comboBox = await getComboBox(0, 0);
        const email = `cash@${fakeStoreProps.domain}`;
        userEvent.type(comboBox, email);
        screen.getByText(`Invite \`${email}\` as an Approver`);
    });

    it('should show an Invite input label when an non existing domain collaborator is added', async () => {
        const comboBox = await getComboBox(0, 0);
        const email = `cash@${fakeStoreProps.domain}`;
        userEvent.type(comboBox, email);
        screen.getByText(`Invite \`${email}\` as an Approver`);
        await selectFirstOptionFromApproverList(0, 0);
        screen.getByDisplayValue(`Invited(${email})`);
    });

    it('should show an empty option text when a non domain email address is added', async () => {
        const comboBox = await getComboBox(0, 0);
        const email = 'cash@gmail.com';
        userEvent.type(comboBox, email);
        screen.getByText(`No results. Invite approvers using @${fakeStoreProps.domain} email`);
    });

    it('should able to add new approvers until all approvers are selected in a single step', async () => {
        const orBtn = await screen.findByRole('button', { name: /_*OR/i });
        const addStepBtn = await screen.findByRole('button', { description: /Add Step/i });

        expect(orBtn).toBeDisabled();
        expect(addStepBtn).toBeDisabled();

        // Doing 4 times since we have a total for 4 approvers in list
        await selectFirstOptionFromApproverList(0, 0);
        expect(orBtn).toBeEnabled();
        expect(addStepBtn).toBeEnabled();

        userEvent.click(orBtn);
        expect(orBtn).toBeDisabled();
        expect(addStepBtn).toBeDisabled();

        await selectFirstOptionFromApproverList(0, 1);
        expect(orBtn).toBeEnabled();
        expect(addStepBtn).toBeEnabled();

        userEvent.click(orBtn);
        expect(orBtn).toBeDisabled();
        expect(addStepBtn).toBeDisabled();

        await selectFirstOptionFromApproverList(0, 2);
        expect(orBtn).toBeEnabled();
        expect(addStepBtn).toBeEnabled();

        userEvent.click(orBtn);
        expect(addStepBtn).toBeDisabled();

        await selectFirstOptionFromApproverList(0, 3);

        userEvent.click(screen.getByTestId('back_btn'));
    });

    it('should send proper response to server', async () => {
        const inputElems = screen.getAllByRole('textbox');
        const flowNameInput = inputElems.filter((item) => item.id === 'flow_name')[0];
        const flowName = 'My first flow';
        userEvent.type(flowNameInput, flowName);

        const orBtn = await screen.findByRole('button', { name: /_*OR/i });
        await selectFirstOptionFromApproverList(0, 0);
        await userEvent.click(orBtn);
        await selectFirstOptionFromApproverList(0, 1);
        const createBtn = getCreateApprovalButton();
        await userEvent.click(createBtn);

        expect(createData.name).toBe(flowName);
        expect(createData.steps.length).toBe(1);
        expect(createData.steps[0].length).toBe(2);
        expect(createData.steps[0][0].type).toBe('SM_USER'); // for sm user
        expect(createData.steps[0][0].value).toBe('1'); // for sm user

        expect(createData.steps[0][1].type).toBe('COLLABORATOR'); // for collaborator
        expect(createData.steps[0][1].value).toBe('1'); // for collaborator
    });
});
