import { Box, Stack, styled, theme, Typography } from '@hiver/hiver-ui-kit';

import { CommonTooltip } from '@components/CommonTooltip';

import { ReactComponent as InfoSvg } from '@assets/info.svg';

const StyledNoOptionsText = styled(Stack)({
    justifyContent: 'space-between',
    flexGrow: '1',
    alignItems: 'center',
    '& .MuiTypography-root': {
        ...theme.typography.body2,
    },
    '& .MuiBox-root': {
        paddingLeft: '10px',
        flexShrink: 0,
        display: 'flex',
    },
});

type NoOptionsTextProps = {
    domain: string;
};

export const NoOptionsText = ({ domain }: NoOptionsTextProps) => (
    <StyledNoOptionsText direction="row">
        <Typography>{`No results. Invite approvers using @${domain} email`}</Typography>
        <CommonTooltip title="Approver accounts are free of charge">
            <Box component="span">
                <InfoSvg />
            </Box>
        </CommonTooltip>
    </StyledNoOptionsText>
);
