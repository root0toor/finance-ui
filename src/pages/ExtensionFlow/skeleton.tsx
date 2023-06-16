import { Box, Skeleton, Stack, theme } from '@hiver/hiver-ui-kit';

const StepSkeleton = ({ isFirstItem = false }: { isFirstItem?: boolean }) => {
    return (
        <Stack
            direction="row"
            sx={{
                alignItems: 'center',
            }}
        >
            {!isFirstItem && (
                <Box
                    sx={{
                        width: '41px',
                        height: '1px',
                        backgroundColor: theme.palette.gray.gray5,
                        marginRight: '4px',
                    }}
                />
            )}
            <Skeleton animation="wave" variant="circular" width={20} height={20} />
        </Stack>
    );
};

export const StepsSkeleton = () => {
    return (
        <Stack
            direction="row"
            sx={{
                overflow: 'hidden',
            }}
        >
            <StepSkeleton isFirstItem />
            <StepSkeleton />
            <StepSkeleton />
            <StepSkeleton />
        </Stack>
    );
};

export const ApprovalSelectSkeleton = () => {
    return <Skeleton animation="wave" variant="rounded" width={140} height={20} />;
};

export const ApprovalBadgeSkeleton = () => {
    return <Skeleton animation="wave" variant="rounded" width={76} height={24} />;
};
