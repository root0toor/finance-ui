import { resetTokenData } from './api';

const APPROVALS_EVENT = 'APPROVALS_EVENT';

type ApprovalEventTypes = 'REFETCH_TOKEN' | 'TOKEN_EXPIRED';

export const createListnerToListenFromOuterWorld = (
    callback?: (message: ApprovalEventTypes, data: unknown) => void
) => {
    const onMessage: EventListenerOrEventListenerObject = (e: Event) => {
        const event = e as CustomEvent;
        const { message, data } = event.detail || {};
        if (message) {
            switch (message as ApprovalEventTypes) {
                case 'TOKEN_EXPIRED':
                    resetTokenData();
                    break;
                default:
                    break;
            }
            callback && callback(message, data);
        }
    };

    const removeListner = () => {
        window.removeEventListener(APPROVALS_EVENT, onMessage);
    };

    const invokeListner = () => {
        window.addEventListener(APPROVALS_EVENT, onMessage);
    };

    // first clearing any previous listners
    removeListner();
    invokeListner();
};
