import React, { useState } from 'react';
import { CommonRadioGroup } from '@components/CommonRadioGroup';
import { Button, CircularProgress, Stack, TextField, theme, Box } from '@hiver/hiver-ui-kit';
import { IApprovalProcessFormData, TRejectionReson } from '@gTypes/applyApproval';

type responseState = 'approvalState' | 'rejectionState';

type responseProps = {
    onApprove: (data: Omit<IApprovalProcessFormData, 'approvalRequestId'>) => void;
    onReject: (data: Omit<IApprovalProcessFormData, 'approvalRequestId'>) => void;
    isLoading?: boolean;
};

type reasonProps = {
    resonOfRejection: TRejectionReson;
    onReasonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    reasonText: string;
    onReasonTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    hasErrorInForm: boolean;
};

type rejectionReasonOptions = {
    label: TRejectionReson;
    value: TRejectionReson;
}[];

const rejectionReasons: rejectionReasonOptions = [
    { label: 'Duplicate', value: 'Duplicate' },
    { label: 'Inaccurate', value: 'Inaccurate' },
    { label: 'Other', value: 'Other' },
];

const ApprovalReason = ({
    resonOfRejection,
    onReasonChange,
    onSubmit,
    onCancel,
    isLoading,
    hasErrorInForm,
    reasonText,
    onReasonTextChange,
}: reasonProps) => {
    return (
        <Stack
            sx={{
                marginTop: '30px',
            }}
        >
            <CommonRadioGroup
                options={rejectionReasons}
                value={resonOfRejection}
                id="apprroval_rejection_reason"
                label="Reason for rejecting"
                onChange={onReasonChange}
                error={hasErrorInForm}
                helperText={hasErrorInForm ? '* Required' : ''}
            />

            <Box
                sx={{
                    minHeight: '80px',
                }}
            >
                <TextField
                    sx={{
                        marginTop: '15px',
                        borderRadius: '4px',
                        outline: 'none',
                        width: '100%',

                        '& .MuiInputBase-root': {
                            padding: '8px 8px 8px 10px',
                        },
                        '& .MuiInputBase-root.MuiOutlinedInput-root:not(.Mui-focused)': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: `${theme.palette.gray.gray5}`,
                                borderWidth: '1px',
                            },
                        },
                        '& fieldset': {
                            borderColor: `${theme.palette.gray.gray5}`,
                            borderWidth: '1px',
                        },
                        '& .Mui-focused': {
                            '& fieldset': {
                                borderWidth: '1px',
                            },
                        },
                        '& textarea': {
                            ...theme.typography.body2,
                            display: 'block',
                            backgroundColor: 'white',
                            padding: '0',
                        },
                        '& textarea:empty::-webkit-input-placeholder': {
                            ...theme.typography.body2,
                            fontFamily: 'Roboto, sans-serif',
                        },
                        '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '1px',
                        },
                    }}
                    id="reason_text_input"
                    multiline
                    placeholder="Additional Notes (Optional)"
                    rows={3}
                    onChange={onReasonTextChange}
                    value={reasonText}
                    inputProps={{
                        maxLength: 100,
                    }}
                />
            </Box>

            <Stack
                sx={{
                    marginTop: '20px',
                }}
                direction="row"
                spacing={1.5}
            >
                <Button
                    title="submit"
                    onClick={onSubmit}
                    disabled={isLoading}
                    disableElevation
                    sx={{
                        minWidth: '79px',
                        backgroundColor: theme.palette.blue.primary,
                        color: 'white',
                        textTransform: 'capitalize',
                        '&.MuiButton-root.Mui-disabled': {
                            backgroundColor: isLoading ? theme.palette.blue.primary : theme.palette.gray.gray6,
                            color: theme.palette.gray.gray4,
                        },
                        '&:hover': {
                            boxShadow: 'none',
                        },
                        ...theme.typography.buttonSmall,
                    }}
                    variant="contained"
                >
                    {isLoading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Submit'}
                </Button>
                <Button
                    title="cancel"
                    onClick={onCancel}
                    disabled={isLoading}
                    disableElevation
                    sx={{
                        borderColor: theme.palette.gray.gray4,
                        textTransform: 'capitalize',
                        color: theme.palette.gray.gray3,
                        ...theme.typography.buttonSmall,
                        '&:hover': {
                            borderColor: theme.palette.gray.gray4,
                            backgroundColor: 'transparent',
                            color: theme.palette.gray.gray3,
                            boxShadow: 'none',
                        },
                    }}
                    variant="outlined"
                >
                    Cancel
                </Button>
            </Stack>
        </Stack>
    );
};

export const ApprovalResponse = ({ onApprove, onReject, isLoading = false }: responseProps) => {
    const [currentState, setApprovalState] = useState<responseState>('approvalState');
    const [typeOfRejection, setRejectionType] = useState<TRejectionReson>('Other');
    const [reasonText, setReasonText] = useState('');
    const [hasErrorInForm, setFormError] = useState(false);

    const isFormValid = () => {
        return !!typeOfRejection;
    };

    const validateForm = () => {
        const valid = isFormValid();
        setFormError(!valid);
        return valid;
    };

    const onApproveApproval = () => {
        onApprove({
            status: 'APPROVED',
            reason: '',
            note: '',
        });
    };

    const onRejectApproval = () => {
        if (!validateForm()) {
            return;
        }
        onReject({
            status: 'REJECTED',
            reason: typeOfRejection,
            note: reasonText,
        });
    };

    const onReasonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReasonText(e.target.value);
    };

    const isApproveLoading = isLoading && currentState === 'approvalState';
    const isRejectLoading = isLoading && currentState === 'rejectionState';

    if (currentState === 'approvalState') {
        return (
            <Stack direction="row" spacing={1.5}>
                <Button
                    disabled={isApproveLoading}
                    onClick={onApproveApproval}
                    disableElevation
                    title="approve"
                    sx={{
                        minWidth: '92px',
                        backgroundColor: theme.palette.green.primary,
                        color: 'white',
                        textTransform: 'capitalize',
                        '&.MuiButton-root.Mui-disabled': {
                            backgroundColor: isApproveLoading ? theme.palette.green.primary : theme.palette.gray.gray6,
                            color: theme.palette.gray.gray4,
                        },
                        '&:hover': {
                            backgroundColor: theme.palette.green.hover,
                            boxShadow: 'none',
                        },
                        ...theme.typography.buttonSmall,
                    }}
                    variant="contained"
                >
                    {isApproveLoading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Approve'}
                </Button>
                <Button
                    title="reject"
                    onClick={() => setApprovalState('rejectionState')}
                    disabled={isApproveLoading}
                    sx={{
                        borderColor: theme.palette.red.primary,
                        color: theme.palette.red.primary,
                        textTransform: 'capitalize',
                        '&:hover': {
                            backgroundColor: theme.palette.red.hover,
                            color: 'white',
                            borderColor: theme.palette.red.primary,
                            boxShadow: 'none',
                        },
                        ...theme.typography.buttonSmall,
                    }}
                    variant="outlined"
                >
                    Reject
                </Button>
            </Stack>
        );
    }

    return (
        <ApprovalReason
            resonOfRejection={typeOfRejection}
            onReasonChange={(e) => setRejectionType(e.target.value as TRejectionReson)}
            reasonText={reasonText}
            onReasonTextChange={onReasonTextChange}
            onSubmit={onRejectApproval}
            isLoading={isRejectLoading}
            hasErrorInForm={hasErrorInForm}
            onCancel={() => setApprovalState('approvalState')}
        />
    );
};
