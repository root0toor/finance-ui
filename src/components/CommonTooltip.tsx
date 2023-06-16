import { styled, Tooltip, tooltipClasses, theme, TooltipProps, SxProps } from '@hiver/hiver-ui-kit';

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.gray.black,
        padding: '8px',
        ...theme.typography.caption,
        color: 'white',
    },
}));

type tooltiPprops = {
    children: React.ReactElement;
    title?: string | React.ReactElement;
    sx?: SxProps;
    placement?: 'top' | 'left' | 'right' | 'bottom';
};

export const CommonTooltip = ({ children, title, sx, placement = 'bottom' }: tooltiPprops) => {
    return (
        <StyledTooltip sx={sx} title={title || ''} placement={placement}>
            {children}
        </StyledTooltip>
    );
};
