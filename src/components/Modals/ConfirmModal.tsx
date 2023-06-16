import { MouseEventHandler } from 'react';
import { Box, Button, CircularProgress, Modal, Stack, theme, Typography } from '@hiver/hiver-ui-kit';
import { CrossButton } from '@components/Buttons/CrossButton';

type modalProps = {
    title: string;
    description: string | React.ReactNode;
    btnText: string;
    btnColor?: string;
    open: boolean;
    footerContent?: string | React.ReactNode;
    onClose: MouseEventHandler;
    onConfirm: MouseEventHandler;
    showCancelBtn?: boolean;
    isLoading?: boolean;
    maxContentWidth?: number;
};

export const ConfirmModal = ({
    title,
    description,
    btnText,
    open,
    onClose,
    btnColor,
    onConfirm,
    isLoading,
    footerContent,
    maxContentWidth,
    showCancelBtn,
}: modalProps) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        maxWidth: `${maxContentWidth || 400}px`,
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                    }}
                >
                    <Stack>
                        <Stack
                            sx={{
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                            }}
                            direction="row"
                        >
                            <Typography
                                sx={{
                                    ...theme.typography.h2,
                                    color: theme.palette.gray.black,
                                }}
                            >
                                {title}
                            </Typography>

                            <CrossButton data-testid="confirm_cross_btn" onClick={onClose} />
                        </Stack>

                        <Typography
                            sx={{
                                ...theme.typography.body2,
                                color: theme.palette.gray.gray2,
                                marginBottom: '20px',
                            }}
                        >
                            {description}
                        </Typography>

                        <Stack
                            direction="row"
                            sx={{
                                alignItems: 'center',
                            }}
                        >
                            {footerContent && (
                                <Typography
                                    sx={{
                                        ...theme.typography.body2,
                                        color: theme.palette.gray.gray2,
                                        marginRight: 'auto',
                                    }}
                                >
                                    {footerContent}
                                </Typography>
                            )}

                            <Stack
                                direction="row"
                                sx={{
                                    marginLeft: 'auto',
                                    gap: '16px',
                                }}
                            >
                                {showCancelBtn && (
                                    <Button
                                        variant="outlined"
                                        onClick={onClose}
                                        sx={{
                                            ...theme.typography.buttonLarge,
                                            color: theme.palette.gray.black,
                                            borderColor: theme.palette.gray.gray5,
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none',
                                                borderColor: theme.palette.gray.gray5,
                                                color: theme.palette.gray.black,
                                            },
                                        }}
                                        disableElevation
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    aria-describedby="confirm_modal_btn"
                                    disabled={isLoading}
                                    onClick={onConfirm}
                                    disableElevation
                                    sx={{
                                        backgroundColor: btnColor || theme.palette.red.primary,
                                        minWidth: '95px',
                                        '&:hover': {
                                            backgroundColor: btnColor || theme.palette.red.hover,
                                        },
                                        display: 'flex',
                                        padding: '8px 22px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        '&.MuiButton-root.Mui-disabled': {
                                            backgroundColor: isLoading
                                                ? theme.palette.red.primary
                                                : theme.palette.gray.gray6,
                                            color: 'white',
                                        },
                                        color: 'white',
                                    }}
                                >
                                    <Typography
                                        id="confirm_modal_btn"
                                        sx={{
                                            textTransform: 'capitalize',
                                            transform: isLoading ? 'translateY(4px)' : '',
                                            ...theme.typography.buttonLarge,
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress
                                                sx={{
                                                    color: 'white',
                                                }}
                                                size={20}
                                            />
                                        ) : (
                                            btnText
                                        )}
                                    </Typography>
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};
