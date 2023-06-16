type fethcMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

enum NetowrkMessage {
    responseFailure = 'Network response is not ok',
    retryAmtExceded = 'Max retry amount exceded',
}

type urlFunc = {
    (configData: typeof config): {
        apiPath: string;
        isV2?: boolean;
    };
};

type Fetcher = {
    <T>(
        url: string | urlFunc,
        method: fethcMethods,
        body?: Record<string, unknown> | unknown,
        headers?: HeadersInit | undefined,
        retries?: number
    ): Promise<T>;
};

type authResponse = {
    token: string;
};

type MockResponseFunc = {
    <T>(mockData: T, time?: number): Promise<T>;
};

const TOKEN_ID = 'TO_*#BN+_KE+#WENIDE#IU_N';
const MAX_RETRY = 3;
let authPromise: Promise<authResponse> | null;

const createTokenKey = (appId: string, tokenId: string, userId: string) => {
    return `${appId}_${tokenId}_${userId}`;
};

const createStorage = (type: 'SESSION' | 'LOCAL') => {
    let storage;

    if (type === 'SESSION') {
        storage = window.sessionStorage;
    } else {
        storage = window.localStorage;
    }
    return storage;
};

const storage = createStorage('SESSION');

const config = {
    userId: '',
    v2Url: '',
    baseUrl: '',
    token: '',
    appId: '',
    isTokenExpired: false,
    isCollaborator: false,
    setToken: function (token: string) {
        this.token = token;
        storage.setItem(createTokenKey(this.appId, TOKEN_ID, this.userId), token);
    },
    getToken: function () {
        return this.token || storage.getItem(createTokenKey(this.appId, TOKEN_ID, this.userId));
    },
};

export const setAppConfig = (v2Url: string, approvalsUrl: string, appId: string, isCollaborator: boolean = false) => {
    config.v2Url = v2Url;
    config.baseUrl = approvalsUrl;
    config.appId = appId;
    config.isCollaborator = isCollaborator;
};

export const setAppUserId = (id: string) => {
    config.userId = id;
};

const getApprovalsBaseUrl = () => {
    if (!config.baseUrl) {
        throw new Error('Base url is not setup. please call the setAppConfig function with the appropriate value');
    }
    return config.baseUrl;
};

const getV2Url = () => {
    if (!config.v2Url) {
        throw new Error('V2 url is not setup. please call the setAppConfig function with the appropriate value');
    }
    return config.v2Url;
};

export const setTokenExpiredStatus = (status: boolean) => {
    config.isTokenExpired = status;
};

export const resetTokenData = () => {
    setTokenExpiredStatus(true);
    authPromise = null;
};

const fetchToken = async (baseUrl: string) => {
    if (!authPromise) {
        const queries = [
            { key: 'usersession', value: config.userId, include: true },
            { key: 'source', value: 'collab_space', include: config.isCollaborator },
        ];

        const query = queries.reduce((prevValue, currentValue) => {
            if (!currentValue.value || !currentValue.include) {
                return prevValue;
            }
            const prefix = prevValue.length === 0 ? '?' : '&';
            return `${prevValue}${prefix}${currentValue.key}=${currentValue.value}`;
        }, '');

        authPromise = fetch(`${baseUrl}/token${query}`, {
            method: 'GET',
            credentials: 'include',
        }).then((resp) => {
            if (!resp.ok) {
                throw new Error(NetowrkMessage.responseFailure, { cause: resp as unknown as Error });
            }
            return resp.json() as Promise<authResponse>;
        });
    }
    return authPromise;
};

const getAppToken = async (baseUrl: string) => {
    const token = config.getToken();
    if (!token || config.isTokenExpired) {
        try {
            const tokenResponse = await fetchToken(baseUrl);
            config.setToken(tokenResponse.token);
            setTokenExpiredStatus(true);
            return tokenResponse.token;
        } catch (err) {
            throw new Error('Failed to fetch auth token');
        }
    }
    return token;
};

export const requestData: Fetcher = async (url, method, body = null, headers = {}, retries = 0) => {
    try {
        if (retries > MAX_RETRY) {
            throw new Error(NetowrkMessage.retryAmtExceded);
        }
        let baseUrl = getApprovalsBaseUrl();
        const v2Url = getV2Url();
        const token = await getAppToken(v2Url);
        const options = {
            method,
            ...(body ? { body: JSON.stringify(body) } : {}),
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
        };

        let apiUrl = url;

        if (typeof url === 'function') {
            const { isV2, apiPath } = url(config);
            apiUrl = isV2 ? `${apiPath}?usersession=${config.userId}` : apiPath;
            baseUrl = isV2 ? v2Url : baseUrl;
        }

        const response = await fetch(`${baseUrl}${apiUrl}`, { ...options, credentials: 'include' });

        if (!response.ok) {
            throw new Error(NetowrkMessage.responseFailure, {
                cause: response as unknown as Error,
            });
        }
        const data = await response.json().catch(() => null);
        return data;
    } catch (err) {
        const error = err as Error;
        if (error && error.cause) {
            const cause = error.cause as unknown as Response;
            switch (cause.status) {
                case 401:
                case 403: {
                    // Authentication error
                    resetTokenData();
                    return requestData(url, method, body, headers, retries + 1);
                }
                default:
                    break;
            }
        }
        throw error;
    }
};

export const createMockResponse: MockResponseFunc = (mockData, time = 3000) => {
    return new Promise((res) => {
        setTimeout(() => {
            res(mockData);
        }, time);
    });
};
