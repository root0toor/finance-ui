type gainsightFunc = {
    (event: string, data?: unknown): void;
};

const createGainsightSetup = () => {
    let eventCallback: gainsightFunc | null = null;

    const setGaignsight = (callback: gainsightFunc) => {
        eventCallback = callback;
    };

    const sendGainsightEvent: gainsightFunc = (event, data) => {
        if (typeof eventCallback === 'function') {
            eventCallback(event, data);
        }
    };

    return {
        setGaignsight,
        sendGainsightEvent,
    };
};

export const { sendGainsightEvent, setGaignsight } = createGainsightSetup();
