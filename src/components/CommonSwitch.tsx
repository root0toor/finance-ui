import { Stack, styled, Switch, Typography } from '@hiver/hiver-ui-kit';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 34,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(18px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(18px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#6BD339',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: '#F09D9D',
        boxSizing: 'border-box',
    },
}));

type switchProps = {
    label: string;
    size?: 'medium' | 'small';
    onChange: (checked: boolean) => void;
    checked: boolean;
    showLabel?: boolean;
    direction?: 'row' | 'column';
};

export const CommonSwitch = ({
    label,
    onChange,
    checked,
    direction = 'row',
    showLabel = true,
    size = 'medium',
}: switchProps) => {
    const onToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };
    return (
        <Stack spacing={1} direction={direction}>
            <StyledSwitch
                size={size}
                checked={checked}
                onChange={onToggle}
                inputProps={{
                    'aria-label': label,
                }}
            />
            {showLabel && <Typography>{label}</Typography>}
        </Stack>
    );
};
