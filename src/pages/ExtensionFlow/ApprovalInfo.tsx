import { Stack, theme, Typography, Box } from '@hiver/hiver-ui-kit';
import { ReactComponent as InfoSvg } from '@assets/info.svg';

type InfoProps = {
    message: string;
};

export const ApprovalInfoBar = ({ message }: InfoProps) => {
    return (
        <Stack
            role="alert"
            aria-describedby="approval_info_alert"
            direction="row"
            spacing={2}
            sx={{
                backgroundColor: theme.palette.blue.light,
                marginTop: '20px',
                borderRadius: '4px',
                padding: '8px 12px',
                width: '100%',
                alignItems: 'center',
            }}
        >
            <Box sx={{ width: '15px', height: '15px' }}>
                <InfoSvg />
            </Box>

            <Typography
                id="approval_info_alert"
                sx={{
                    ...theme.typography.caption,
                }}
                color={theme.palette.gray.black}
            >
                {message}
            </Typography>
        </Stack>
    );
};
