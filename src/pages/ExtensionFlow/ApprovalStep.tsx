import { ReactElement } from 'react';

import { Box, Stack, theme } from '@hiver/hiver-ui-kit';

import { TApprovalStep } from '@gTypes/applyApproval';
import { CommonTooltip } from '@components/CommonTooltip';

import { ReactComponent as ApprovedSvg } from '@assets/step_approved.svg';
import { ReactComponent as InitSvg } from '@assets/step_init.svg';
import { ReactComponent as RejectedSvg } from '@assets/step_rejected.svg';

const getBgColor = (type: TApprovalStep) => {
    switch (type) {
        case 'IDLE':
        case 'CANCELLED':
            return theme.palette.gray.gray5;
        case 'INITIATED':
        case 'APPROVED':
            return theme.palette.green.primary;
        case 'REJECTED':
            return theme.palette.red.primary;
        default:
            return '';
    }
};

const getIcon = (type: TApprovalStep): ReactElement | null => {
    switch (type) {
        case 'INITIATED':
            return <InitSvg />;
        case 'APPROVED':
            return <ApprovedSvg />;
        case 'REJECTED':
        case 'CANCELLED':
            return <RejectedSvg />;
        default:
            return null;
    }
};

export const ApprovalStep = ({
    type,
    details,
    showDivider,
    disabled = false,
}: {
    type: TApprovalStep;
    details: string | React.ReactElement;
    showDivider: boolean;
    disabled?: boolean;
}) => {
    const bgColor = getBgColor(disabled ? 'IDLE' : type);
    const icon = getIcon(type);
    // else case will only happen for multiple init steps
    const dividerColor = type === 'INITIATED' ? getBgColor('IDLE') : bgColor;
    return (
        <Stack
            direction="row"
            sx={{
                alignItems: 'center',
            }}
        >
            {showDivider && (
                <Box
                    sx={{
                        width: '41px',
                        height: '1px',
                        backgroundColor: dividerColor,
                        marginRight: '4px',
                    }}
                />
            )}

            <CommonTooltip title={details}>
                <Box
                    role="listitem"
                    component="span"
                    sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '4px',
                        backgroundColor: bgColor,
                        '& path': {
                            fill: disabled ? theme.palette.gray.gray3 : '',
                        },
                    }}
                >
                    {icon}
                </Box>
            </CommonTooltip>
        </Stack>
    );
};
