import {
    Box,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    styled,
    SxProps,
    theme,
    SelectProps,
} from '@hiver/hiver-ui-kit';

import { ReactComponent as DownArrowSvg } from '@assets/down-arrow.svg';
import { ReactComponent as CrossSvg } from '@assets/close.svg';
import { CommonTooltip } from './CommonTooltip';

type option = { label: string; value: string; hidden?: boolean };

type CommonSelectProps = {
    options: option[];
    id: string;
    disabled?: boolean;
    value: string;
    onChange: (e: SelectChangeEvent<unknown>) => void;
    placeholder: string;
    sx: SxProps;
    defaultValue: string;
    emptyText: string;
    onCancel: (value: string) => void;
    cancelButtonTooltip?: string;
    showCancelBtn?: boolean;
};

const DownIcon = () => {
    return (
        <Box
            sx={{
                width: '8px',
                height: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'absolute',
                right: '0px',
                zIndex: '-1',
            }}
        >
            <DownArrowSvg />
        </Box>
    );
};

export const EmptyIcon = () => {
    return <Box />;
};

const CrossIcon = () => {
    return (
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
    );
};

const StyledSelect = styled(Select)<SelectProps>`
    '& .muioutlinedinput-notchedoutline': {
        border: 'none';
    }

    ,

'& .muimenuitem-root .mui-selected': {
        background-color: none !important;
    }
`;

const menuFontStyle = {
    ...theme.typography.body2,
    color: theme.palette.gray.gray1,
};

export const CommonSelect = ({
    id,
    options,
    value,
    onChange,
    placeholder,
    sx,
    defaultValue,
    onCancel,
    cancelButtonTooltip,
    emptyText,
    showCancelBtn = true,
    disabled = false,
}: CommonSelectProps) => {
    return (
        <Stack
            sx={{
                '& .MuiTypography-body1': {
                    marginLeft: 0,
                },
            }}
            direction="row"
            spacing={1}
        >
            <StyledSelect
                sx={{
                    '& .MuiSelect-select': {
                        paddingLeft: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                        paddingRight: '18px !important',
                        ...menuFontStyle,
                        color: theme.palette.gray.black,
                    },
                    '& .Mui-disabled ': {
                        WebkitTextFillColor: theme.palette.gray.black,
                    },

                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '& .MuiMenuItem-root .Mui-selected': {
                        backgroundColor: ' none !important',
                    },
                    isolation: 'isolate',
                    ...sx,
                }}
                id={id}
                labelId={`${id}_label`}
                value={value}
                onChange={onChange}
                disabled={disabled}
                defaultValue={defaultValue}
                IconComponent={value ? EmptyIcon : DownIcon}
                displayEmpty={true}
                renderValue={(value) => (value ? options.find((item) => item.value === value)?.label : placeholder)}
                MenuProps={{
                    sx: {
                        '& .MuiPaper-root': {
                            maxHeight: '185px',
                        },
                    },
                }}
            >
                {options.length === 0 && (
                    <MenuItem sx={{ ...menuFontStyle }} disabled={true} value="">
                        {emptyText}
                    </MenuItem>
                )}
                {options.map((item) => {
                    if (item.hidden) {
                        return;
                    }
                    return (
                        <MenuItem sx={{ ...menuFontStyle }} key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    );
                })}
            </StyledSelect>
            {value && showCancelBtn && (
                <CommonTooltip title={cancelButtonTooltip || ''}>
                    <IconButton
                        data-testid={`${id}_cancel_btn`}
                        onClick={() => onCancel(value)}
                        sx={{
                            padding: '0',
                            width: '20px',
                            height: '20px',
                        }}
                    >
                        <CrossIcon />
                    </IconButton>
                </CommonTooltip>
            )}
        </Stack>
    );
};
