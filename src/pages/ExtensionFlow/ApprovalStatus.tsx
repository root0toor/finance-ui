import { ReactElement } from 'react';

import { Box, theme, Typography } from '@hiver/hiver-ui-kit';

import { ReactComponent as RejectedSvg } from '@assets/cancel_red.svg';
import { ReactComponent as ApprovedSvg } from '@assets/check_green.svg';
import { ReactComponent as PendingSvg } from '@assets/pending_orange.svg';
import { TApprovalStatus } from '@gTypes/applyApproval';

type statusProps = {
    type: TApprovalStatus;
};

const getBackgroundColor = (type: TApprovalStatus) => {
    switch (type) {
        case 'PENDING':
            return theme.palette.orange.light;
        case 'APPROVED':
            return theme.palette.green.light;
        case 'REJECTED':
            return theme.palette.red.light;
        default:
            return 'white';
    }
};

const getTextColor = (type: TApprovalStatus) => {
    switch (type) {
        case 'PENDING':
            return theme.palette.orange.hover;
        case 'APPROVED':
            return theme.palette.green.hover;
        case 'REJECTED':
            return theme.palette.red.hover;
        default:
            return 'black';
    }
};

const getIcon = (type: TApprovalStatus): ReactElement | null => {
    switch (type) {
        case 'PENDING':
            return <PendingSvg />;
        case 'APPROVED':
            return <ApprovedSvg />;
        case 'REJECTED':
            return <RejectedSvg />;
        default:
            return null;
    }
};

const getText = (type: TApprovalStatus) => {
    switch (type) {
        case 'PENDING':
            return 'Pending';
        case 'APPROVED':
            return 'Approved';
        case 'REJECTED':
            return 'Rejected';
        default:
            return '';
    }
};

export const ApprovalStatus = ({ type }: statusProps) => {
    const bgColor = getBackgroundColor(type);
    const textColor = getTextColor(type);
    const text = getText(type);
    const Icon = getIcon(type);

    return (
        <Box
            sx={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
            }}
        >
            {Icon}
            <Typography
                title={text}
                sx={{
                    ...theme.typography.caption,
                }}
                color={textColor}
            >
                {text}
            </Typography>
        </Box>
    );
};
