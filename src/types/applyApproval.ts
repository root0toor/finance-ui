export type TApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type TApprovalStep = 'IDLE' | 'INITIATED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type TRejectionReson = 'Duplicate' | 'Inaccurate' | 'Other' | '';

export interface IApprovalRquestDetail {
    id: number;
    statusDetails: string;
    approvalRequestId: number;
    stepId: number;
    status: TApprovalStep;
    reason: string;
    note: string;
    updatedAt: string;
    isCancelled: boolean;
}

export interface IApprovalRequest {
    isApprover: boolean;
    currentStepId: number;
    status: TApprovalStatus;
    statusDetails: string;
    approvalFlowId: number;
    approvalRequestId: number;
    approvalRequestDetails: IApprovalRquestDetail[];
}

export interface IApprovalRequestApiResponse {
    data: IApprovalRequest | null;
}

export interface IApprovalRequestFormData {
    approvalFlowId: string;
    conversationId: string;
    smId: string;
}

export type TApprovalProcessFormStatus = 'APPROVED' | 'REJECTED' | 'CANCELLED';
export interface IApprovalProcessFormData {
    approvalRequestId: string;
    status: TApprovalProcessFormStatus;
    reason: TRejectionReson;
    note: string;
}
