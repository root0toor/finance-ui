import { Box, IconButton, IconButtonProps } from '@hiver/hiver-ui-kit';

import { ReactComponent as MinusSvg } from '@assets/minus.svg';

export const MinusButton = (props: IconButtonProps) => {
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
                <MinusSvg />
            </Box>
        </IconButton>
    );
};
