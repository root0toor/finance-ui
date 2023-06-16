import { Box, Stack, theme, Typography } from '@hiver/hiver-ui-kit';

export const CommonErrorFallback = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
            }}
        >
            <Stack
                spacing={1}
                sx={{
                    alignItems: 'center',
                }}
            >
                <img
                    style={{
                        aspectRatio: '1/1',
                        objectFit: 'contain',
                        maxWidth: '100%',
                    }}
                    src="https://ik.imagekit.io/hiver/images/views-empty-state-icons/no-result-identity.png"
                    alt="Bee showing error"
                />
                <Typography
                    sx={{
                        ...theme.typography.h3,
                    }}
                >
                    Something went wrong ...
                </Typography>
            </Stack>
        </Box>
    );
};
