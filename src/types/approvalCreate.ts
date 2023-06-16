export type StepBody = {
    type: 'COLLABORATOR' | 'SM_USER' | '';
    value: string;
};

export interface IApprovalFormBody {
    name: string;
    smId: string;
    steps: StepBody[][];
}

export interface IApprovalFlowUpdateFormBody {
    name?: string;
    isActive?: boolean;
    smId: string;
}
