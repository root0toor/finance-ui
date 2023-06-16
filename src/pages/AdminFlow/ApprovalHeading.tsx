import { Box, IconButton, Stack, theme, Typography, TextField, CircularProgress, Chip } from '@hiver/hiver-ui-kit';

import { ReactComponent as PencilSvg } from '@assets/pencil.svg';
import { ReactComponent as ArchiveSvg } from '@assets/archive.svg';
import { ReactComponent as CheckSvg } from '@assets/check_filled_green.svg';
import { ReactComponent as CrossSvg } from '@assets/cross_filled.svg';
import { CommonTooltip } from '@components/CommonTooltip';

type viewProps = {
    approvalName: string;
    onEdit: () => void;
    toggleConfirm: () => void;
    isArchived: boolean;
};

export const ApprovalListHeadingViewConent = ({ approvalName, onEdit, isArchived, toggleConfirm }: viewProps) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Typography
                sx={{
                    ...theme.typography.body2,
                }}
            >
                {approvalName}
            </Typography>
            {isArchived && (
                <Box title="archive_chip">
                    <Chip
                        sx={{
                            color: theme.palette.gray.gray4,
                            borderColor: theme.palette.gray.gray4,
                            pointerEvents: 'none',
                        }}
                        label="Archived"
                        variant="outlined"
                    />
                </Box>
            )}

            {!isArchived && (
                <>
                    <CommonTooltip title="Rename">
                        <IconButton
                            sx={{
                                display: 'none',
                            }}
                            data-testid={`edit_btn_${approvalName}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <PencilSvg
                                style={{
                                    width: '13px',
                                    height: '13px',
                                }}
                            />
                        </IconButton>
                    </CommonTooltip>

                    <CommonTooltip title="Archive approval flow">
                        <IconButton
                            sx={{
                                display: 'none',
                                marginLeft: 'auto !important',
                            }}
                            data-testid={`archive_btn_${approvalName}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleConfirm();
                            }}
                        >
                            <ArchiveSvg
                                style={{
                                    width: '14px',
                                    height: '14px',
                                }}
                            />
                        </IconButton>
                    </CommonTooltip>
                </>
            )}
        </Stack>
    );
};

type editProps = {
    id: string;
    toggleEditMode: () => void;
    onCheck: () => void;
    isLoading: boolean;
    inputProps: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
    hasError: boolean;
};

export const ApprovalListHeadingEditConent = ({
    id,
    toggleEditMode,
    inputProps,
    hasError,
    onCheck,
    isLoading,
}: editProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexFlow: 'row nowrap',
                flexGrow: '1',
                alignItems: 'strecth',
            }}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <TextField
                autoFocus
                sx={{
                    width: '100%',
                    '& input': {
                        padding: 0,
                    },
                    '& fieldset': {
                        border: 'none',
                    },
                    '& .MuiInputBase-root': {
                        height: '100%',
                    },
                }}
                id={`approval_name_edit_${id}`}
                variant="outlined"
                {...inputProps}
            />

            <Stack direction="row" spacing={1}>
                <IconButton
                    title="Update approval"
                    disabled={hasError || isLoading}
                    onClick={onCheck}
                    sx={{
                        '& path': {
                            fill: hasError ? theme.palette.gray.gray5 : '',
                        },
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <CheckSvg
                            style={{
                                width: '20px',
                                height: '20px',
                            }}
                        />
                    )}
                </IconButton>
                <IconButton title="Cancel edit" disabled={isLoading} onClick={toggleEditMode}>
                    <CrossSvg
                        style={{
                            width: '20px',
                            height: '20px',
                        }}
                    />
                </IconButton>
            </Stack>
        </Box>
    );
};
