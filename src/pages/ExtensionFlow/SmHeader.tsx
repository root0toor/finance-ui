import { Box, Stack, Typography, theme } from '@hiver/hiver-ui-kit';

import { ReactComponent as MailboxSvg } from '@assets/shared_mailbox.svg';

type smHeaderProps = {
    smName: string;
};
export const SmHeader = ({ smName }: smHeaderProps) => {
    return (
        <Box>
            <Stack
                direction="row"
                sx={{
                    alignItems: 'center',
                }}
                spacing={1}
            >
                <MailboxSvg
                    style={{
                        width: '20px',
                        height: '20px',
                    }}
                />
                <Typography
                    sx={{
                        ...theme.typography.h2,
                        // @ts-ignore: dark property exists
                        color: theme.palette.gray.dark,
                        textTransform: 'capitalize',
                    }}
                >
                    {smName}
                </Typography>
            </Stack>
        </Box>
    );
};
