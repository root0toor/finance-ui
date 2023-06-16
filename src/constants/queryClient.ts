export const QUERY_STALE_TIME = 1000 * 60; // 1 min of stale time defined

export const appQueryOptions = {
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    retryOnMount: true,
};
