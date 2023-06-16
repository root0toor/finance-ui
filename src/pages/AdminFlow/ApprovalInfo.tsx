import { Container, Stack, theme, Typography, Box } from '@hiver/hiver-ui-kit';
import { ReactComponent as EmptyDocSvg } from '@assets/empty_doc.svg';
import { APPROVALS_KB_LINK } from '@constants/admin';

type infoProps = {
    type: 'EMPTY' | 'DISABLED';
};
export const ApprovalInfo = ({ type }: infoProps) => {
    const showTitle = type === 'EMPTY';
    return (
        <Container
            maxWidth="sm"
            sx={{
                width: '100%',
                height: '100%',
                paddingTop: '160px',
            }}
        >
            <Stack
                sx={{
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '125px',
                        height: '125px',
                        marginBottom: '28px',
                    }}
                >
                    <EmptyDocSvg />
                </Box>

                {showTitle && (
                    <Typography
                        sx={{
                            ...theme.typography.h3,
                            color: '#4D6370',
                            marginBottom: '8px',
                        }}
                    >
                        No Approval Flow Created
                    </Typography>
                )}

                <Typography
                    sx={{
                        ...theme.typography.body2,
                        color: theme.palette.gray.gray3,
                        maxWidth: '397px',
                        textAlign: 'center',
                    }}
                >
                    Define Multi-step Approval Workflows and request Approvals from anyone in your organisation, right
                    inside Gmail.
                    <a
                        href={APPROVALS_KB_LINK}
                        target="_blank"
                        rel="noreferrer"
                        referrerPolicy="no-referrer"
                        style={{
                            color: theme.palette.blue.primary,
                        }}
                    >
                        Learn more
                    </a>
                </Typography>
            </Stack>
        </Container>
    );
};
