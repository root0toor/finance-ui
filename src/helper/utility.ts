type ParentMessage = 'refetch-account-refresh';

export const sendMessageToParentWindow = (key: ParentMessage, extraParams = {}) => {
    window.parent && window.parent.postMessage({ taskType: key, ...extraParams }, '*');
    window.parent.parent &&
        window.parent.parent.postMessage({ taskType: key, refetchReactAccountRefreshData: true, ...extraParams }, '*');
};
