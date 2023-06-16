import { Box, IconButton, IconButtonProps } from '@hiver/hiver-ui-kit';

import { ReactComponent as CrossSvg } from '@assets/close.svg';

export const CrossButton = (props: IconButtonProps) => {
    return (
        <IconButton {...props}>
            <Box
                sx={{
                    width: '10px',
                    height: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CrossSvg />
            </Box>
        </IconButton>
    );
};
