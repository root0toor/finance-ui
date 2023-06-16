import React, { useReducer, useContext } from 'react';

enum reducerActions {
    'ADD_STEP' = 'ADD_STEP',
    'ADD_APPROVER' = 'ADD_APPROVER',
    'CHANGE_APPROVER' = 'CHANGE_APPROVER',
    'CLEAR_APPROVER' = 'CLEAR_APPROVER',
    'CLEAR_STORE' = 'CLEAR_STORE',
    'CLEAR_STEP' = 'CLEAR_STEP',
}

export type TapproverValue = {
    label: string;
    id: string;
};

export type Tapprover = {
    id: number;
    value: TapproverValue | null | undefined;
};

export type Tstep = {
    stepNumber: number;
    approvers: Tapprover[];
};

type TStepStore = {
    steps: Tstep[];
};

type FormProviderProps = {
    children: React.ReactElement;
};

type Taction = {
    type: keyof typeof reducerActions;
    payload?: {
        stepNumber?: number;
        approverId?: number;
        approverValue?: TapproverValue | null;
    };
};

type initContext = {
    store: TStepStore;
    addStep: () => void;
    clearStore: () => void;
    clearStep: (stepNumber: number) => void;
    addApprover: (stepNumber: number) => void;
    clearApprover: (stepNumber: number, approverId: number) => void;
    changeApproverValue: (stepNumber: number, approverId: number, data: TapproverValue | null) => void;
};

const createAnEmptyApprover = (id: number) => {
    return {
        id,
        value: { label: '', id: '' },
    };
};

const createAnEmptyStep = (stepNum: number) => {
    return {
        stepNumber: stepNum,
        approvers: [createAnEmptyApprover(0)],
    };
};

const addNewStepInStore = (store: TStepStore): TStepStore => {
    return {
        ...store,
        steps: [...store.steps, createAnEmptyStep(store.steps[store.steps.length - 1].stepNumber + 1)],
    };
};

const addNewApproverInStep = (store: TStepStore, stepNum?: number): TStepStore => {
    if (typeof stepNum !== 'number') {
        return store;
    }
    const newSteps: Tstep[] = JSON.parse(JSON.stringify(store.steps));
    const step = newSteps.find((step) => step.stepNumber === stepNum);
    if (step) {
        const lastApproverId = step.approvers[step.approvers.length - 1].id;
        step.approvers = [...step.approvers, createAnEmptyApprover(lastApproverId + 1)];
        return {
            ...store,
            steps: newSteps,
        };
    }

    return store;
};

const changeApproverValueInStep = (
    store: TStepStore,
    data?: TapproverValue | null,
    stepNum?: number,
    approverId?: number
): TStepStore => {
    if (typeof stepNum !== 'number' || typeof approverId !== 'number') {
        return store;
    }

    const newSteps: Tstep[] = JSON.parse(JSON.stringify(store.steps));
    const step = newSteps.find((step) => step.stepNumber === stepNum);

    if (step) {
        const newApprovers = [...step.approvers];
        const approver = newApprovers.find((app) => app.id === approverId);
        if (approver) {
            approver.value = data;
            step.approvers = newApprovers;
            return {
                ...store,
                steps: newSteps,
            };
        }
    }
    return store;
};

const clearApproverFromStep = (store: TStepStore, stepNum?: number, approverId?: number): TStepStore => {
    if (typeof stepNum !== 'number' || typeof approverId !== 'number') {
        return store;
    }

    const newSteps: Tstep[] = JSON.parse(JSON.stringify(store.steps));
    const step = newSteps.find((step) => step.stepNumber === stepNum);

    if (step) {
        const newApprovers = step.approvers.filter((approver) => approver.id !== approverId);
        step.approvers = newApprovers;
        return {
            ...store,
            steps: newSteps,
        };
    }
    return store;
};

const clearStepFromStore = (store: TStepStore, stepNum?: number) => {
    if (typeof stepNum !== 'number') {
        return store;
    }

    const newSteps = store.steps.filter((step) => step.stepNumber !== stepNum);
    return {
        ...store,
        steps: newSteps,
    };
};

const createEmptyStore = () => {
    return {
        steps: [createAnEmptyStep(0)],
    };
};

const FormContext = React.createContext<initContext>({
    store: createEmptyStore(),
    addStep: () => {
        // empty function
    },
    addApprover: () => {
        // empty function
    },
    changeApproverValue: () => {
        // empty function
    },
    clearStore: () => {
        // empty function
    },
    clearStep: () => {
        // empty function
    },
    clearApprover: () => {
        // empty function
    },
});

const reducer = (store: TStepStore, action: Taction) => {
    const { type, payload } = action;
    switch (type) {
        case 'ADD_STEP':
            return addNewStepInStore(store);
        case 'ADD_APPROVER':
            return addNewApproverInStep(store, payload?.stepNumber);
        case 'CHANGE_APPROVER':
            return changeApproverValueInStep(store, payload?.approverValue, payload?.stepNumber, payload?.approverId);
        case 'CLEAR_STEP':
            return clearStepFromStore(store, payload?.stepNumber);
        case 'CLEAR_APPROVER':
            return clearApproverFromStep(store, payload?.stepNumber, payload?.approverId);
        case 'CLEAR_STORE':
            return createEmptyStore();
        default:
            return store;
    }
};

export const FormProvider = ({ children }: FormProviderProps) => {
    const [store, dispatch] = useReducer(reducer, null, () => createEmptyStore());

    const addStep = () => {
        dispatch({
            type: 'ADD_STEP',
        });
    };

    const addApprover = (stepNumber: number) => {
        dispatch({
            type: 'ADD_APPROVER',
            payload: { stepNumber },
        });
    };

    const changeApproverValue = (stepNumber: number, approverId: number, data: TapproverValue | null) => {
        dispatch({
            type: 'CHANGE_APPROVER',
            payload: { stepNumber, approverId, approverValue: data },
        });
    };

    const clearApprover = (stepNumber: number, approverId: number) => {
        dispatch({
            type: 'CLEAR_APPROVER',
            payload: { stepNumber, approverId },
        });
    };

    const clearStore = () => {
        dispatch({
            type: 'CLEAR_STORE',
        });
    };

    const clearStep = (stepNumber: number) => {
        dispatch({
            type: 'CLEAR_STEP',
            payload: { stepNumber },
        });
    };

    const value = {
        store,
        addStep,
        addApprover,
        changeApproverValue,
        clearStore,
        clearStep,
        clearApprover,
    };

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormStore = () => {
    return useContext(FormContext).store;
};

export const useFormActions = () => {
    const { addApprover, addStep, changeApproverValue, clearStore, clearStep, clearApprover } = useContext(FormContext);
    return { addApprover, addStep, changeApproverValue, clearStore, clearStep, clearApprover };
};
