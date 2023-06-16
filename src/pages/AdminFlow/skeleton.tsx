import { Skeleton, Stack } from '@hiver/hiver-ui-kit';

const ListItemSkeleton = () => {
    return <Skeleton variant="rounded" width="100%" height={61} animation="wave" />;
};

export const CreatedBySkeleton = () => {
    return <Skeleton variant="rounded" width={100} height={10} animation="wave" />;
};

export const ApprovalsListSkeleton = () => {
    return (
        <Stack spacing={3}>
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
        </Stack>
    );
};
