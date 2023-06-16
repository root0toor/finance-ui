import { IApproval, IApprover, IStepApprover } from '@gTypes/approvalList';
import { Tstep } from './FormContext';

export const validateNonEmptyText = (value: unknown) => !!value;
export const validateTextLengthShouldNotCross = (value: string, length: number) => value.length <= length;
export const isNameAlreadyPresent = (value: string, exsistingApprovalsList: IApproval[]) =>
    !!exsistingApprovalsList.find((item) => item.name.toLocaleLowerCase() === value.trim().toLowerCase());

export const validateNameField = (value: string, exsistingApprovalsList: IApproval[]) => {
    let hasError = false;
    let message = '';

    if (!validateNonEmptyText(value)) {
        hasError = true;
        message = 'Approval flow name is required';
    } else if (!validateTextLengthShouldNotCross(value, 30)) {
        hasError = true;
        message = 'Character limit for Approval Flow names is 30';
    } else if (isNameAlreadyPresent(value, exsistingApprovalsList)) {
        hasError = true;
        message = 'An Approval Flow with this name already exists';
    }
    return {
        hasError,
        message,
    };
};

type TStepStore = {
    [key: string]: {
        [key: string]: {
            value: () => { label: string; id: string } | null | undefined;
            isValid: (shoudlFocus?: boolean) => boolean;
        };
    };
};

export const isApproversFormValid = (steps: Tstep[]) => {
    const stepVals = Object.values(steps);
    let isValid = true;
    for (const step of stepVals) {
        const emptyApprover = step.approvers.find((item) => !item.value || !item.value.id);
        if (emptyApprover) {
            isValid = false;
            break;
        }
    }
    return isValid;
};

export const hasErrorInAnyStep = (stepsStore: TStepStore) => {
    const stepsKeys = Object.keys(stepsStore);
    let isApproversFormValid = true;
    stepsKeys.forEach((stepNumber) => {
        const subStepsValues = Object.values(stepsStore[stepNumber]);
        subStepsValues.forEach(({ isValid }) => {
            const status = isValid(false);
            isApproversFormValid = isApproversFormValid && status;
        });
    });
    return !isApproversFormValid;
};

export const getAllSelectedApproverIds = (steps: Tstep[]) => {
    let result: (string | undefined)[] = [];
    steps.forEach(({ approvers }) => {
        const currStepIds = approvers.map((item) => item.value?.id).filter(Boolean);
        result = [...result, ...currStepIds];
    });
    return result;
};

export const getStepApproversName = (stepApprovers: IStepApprover[], approvers: IApprover[]) => {
    return stepApprovers
        .map((stepApprover) => {
            const user = approvers.find((item) => {
                const sameType = stepApprover.type === item.type;
                const sameId = item.id.split('_')[0] == stepApprover.id;
                return sameType && sameId;
            });
            const nameOrEmail = user?.firstname || user?.email;
            return user?.type === 'COLLABORATOR' ? `Invited(${nameOrEmail})` : nameOrEmail;
        })
        .join(' / ');
};

export const getApproverIdPart = (id: string) => {
    return id.split('_')[0];
};

export const getCreatedByUserName = (approvers: IApprover[], createdBy: string): string | undefined => {
    const user = approvers.find((item) => {
        const isSmUser = item.type === 'SM_USER';
        return isSmUser && getApproverIdPart(item.id) == createdBy;
    });
    return user?.firstname || user?.email;
};
