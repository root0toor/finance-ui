export const apiPaths = {
    common: {
        smApprovers: (smId: string) => `/approvals/smcollaboratorlist?smIds=${smId}`,
        getToken: () => `/token`,
    },
    adminPanel: {
        createApproval: () => `/approvals/approvalflow/create`,
        updateApproval: (approvalFlowId: string) => `/approvals/approvalflow/${approvalFlowId}`,
        approvalList: (smId: string) => `/approvals/approvalflow/smapprovalflowlist/${smId}`,
        ugUserDetail: (userId: string) => `/api/settings/users/${userId}`,
    },
    extension: {
        createApprovalRequest: () => `/approvals/approvalrequest/create`,
        approvalRequestDetails: (conversationId: string, smId: string) =>
            `/approvals/approvalrequest/details?conversation_id=${conversationId}&sm_id=${smId}`,
        processApprovalRequest: () => `/approvals/approvalrequest/process`,
    },
};
