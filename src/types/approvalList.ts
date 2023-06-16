import { FunctionComponent } from 'react';

export interface IStepApprover {
    id: string;
    type: 'COLLABORATOR' | 'SM_USER';
}

export interface IStep {
    stepId: string;
    stepApprovers: IStepApprover[];
}

export interface IApproval {
    id: string;
    name: string;
    createdBy: string;
    usergroupId: string;
    isActive: boolean;
    steps: IStep[];
}

export interface IApprover {
    id: string;
    email: string;
    type: 'COLLABORATOR' | 'SM_USER';
    firstname?: string | null;
    lastname?: string | null;
}

export interface ICollaboratorApprover {
    id: string;
    email: string;
}

export interface ISmUser {
    email: string;
    userid: string;
    firstname: string;
    lastname: string | null | undefined;
}

export type ApproverListDataType = {
    data: ICollaboratorApprover[];
};

export type ApprovalListDataType = {
    data: IApproval[];
};

export type PromptModalType = FunctionComponent<{
    shown: boolean;
    title?: string;
    description?: string;
    onLeave: () => void;
    onStay: () => void;
}>;

export interface IUgUser {
    id: string;
    email: string;
    firstname?: string;
    lastname?: string;
}
