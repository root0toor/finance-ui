import ReactDom from 'react-dom';
import { CrossButton } from '@components/Buttons/CrossButton';
import { Button, Paper, Stack, SxProps, theme, Typography, keyframes, Box } from '@hiver/hiver-ui-kit';
import { APPROVALS_KB_LINK } from '@constants/extension';
import { ReactComponent as HiverLogoSvg } from '@assets/hiver_logo_transparent.svg';
import { ReactComponent as TriangleSvg } from '@assets/triangle.svg';

type onboardProps = {
    onClose: () => void;
    open: boolean;
    boxProps?: SxProps;
    dimensions: () => { top: number; right: number };
};

const SlideIn = keyframes`
0%{
    transform: translateY(10%);
    opacity: 0;
}
100%{
    transform: translateY(0);
    opacity: 1;
}
`;
const OnboardPopperContainer = ({ dimensions, boxProps, onClose, open }: onboardProps) => {
    if (!open) {
        return null;
    }

    const { top, right } = dimensions();

    return (
        <Paper
            role="presentation"
            aria-describedby="popover_guider"
            sx={{
                padding: '24px',
                maxWidth: '297px',
                position: 'fixed',
                animation: `${SlideIn} ease 0.5s forwards`,
                boxShadow: 'none',
                filter: 'drop-shadow(1px 0px 8px rgb(0 0 0 / 25%))',
                zIndex: 10000,
                top,
                right,
                ...boxProps,
            }}
        >
            <Stack
                sx={{
                    position: 'relative',
                    isolation: 'isolate',
                }}
            >
                <Typography
                    id="popover_guider"
                    sx={{
                        ...theme.typography.h2,
                        color: '#383838',
                        marginBottom: '10px',
                        fontWeight: '400',
                        lineHeight: '25px',
                    }}
                >
                    Now request Approvals on conversations
                </Typography>
                <Typography
                    sx={{
                        ...theme.typography.body2,
                        color: '#666666',
                        marginBottom: '15px',
                    }}
                >
                    Approvers will receive a link to the conversation and can approve or deny the request. Hiver will
                    notify you once the Approval process is complete.
                    <a
                        href={APPROVALS_KB_LINK}
                        rel="no-opener"
                        style={{
                            textDecoration: 'none',
                            color: theme.palette.blue.primary,
                        }}
                    >
                        Learn more
                    </a>
                </Typography>

                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        disableElevation
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            ...theme.typography.h4,
                            color: '#323C3D',
                            backgroundColor: '#FCCA47',
                            textTransform: 'capitalize',
                            '&:hover': {
                                backgroundColor: '#FCCA47',
                                opacity: 0.9,
                            },
                        }}
                    >
                        Okay
                    </Button>
                    <HiverLogoSvg />
                </Stack>
                <CrossButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        width: '14px',
                        height: '14px',
                        top: '44%',
                        right: '-37px',
                    }}
                >
                    <TriangleSvg />
                </Box>
            </Stack>
        </Paper>
    );
};

export const OnboardPopper = (props: onboardProps) => {
    return ReactDom.createPortal(<OnboardPopperContainer {...props} />, document.body);
};
