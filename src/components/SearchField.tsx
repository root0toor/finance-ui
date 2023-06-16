import { SyntheticEvent } from 'react';

import {
    Autocomplete,
    Box,
    Stack,
    SxProps,
    TextField,
    theme,
    Typography,
    FilterOptionsState,
} from '@hiver/hiver-ui-kit';
import { CommonTooltip } from '@components/CommonTooltip';

import { ReactComponent as InfoSvg } from '@assets/info.svg';

export type SearchFieldoption = {
    label: string;
    id: string;
    email?: string;
    tooltip?: string;
};

export type SearchFieldProps = {
    options: SearchFieldoption[];
    onChange: (e: SyntheticEvent, value: SearchFieldoption | null) => void;
    onInputChange: (e: SyntheticEvent, value: string) => void;
    value: SearchFieldoption | null;
    inputValue: string;
    open: boolean;
    onOpen: (e: SyntheticEvent) => void;
    onClose: (e: SyntheticEvent) => void;
    hasError?: boolean;
    sx?: SxProps;
    id: string;
    placeholder?: string;
    noOptionsText?: React.ReactNode;
    getOptionLabel?: ((option: SearchFieldoption) => string) | undefined;
    filterOptions?:
        | ((options: SearchFieldoption[], state: FilterOptionsState<SearchFieldoption>) => SearchFieldoption[])
        | undefined;
};

const renderOption = (props: Record<string, unknown>, option: SearchFieldoption) => {
    const showIcon = option.label.includes('Invite');
    return (
        <Box
            {...props}
            key={option.id}
            sx={{
                '&.MuiAutocomplete-option': {
                    backgroundColor: '#FBFCFE !important',
                    '&:hover': {
                        backgroundColor: '#F2F6FF !important',
                    },
                },
            }}
        >
            <Stack
                direction="row"
                sx={{
                    justifyContent: 'space-between',
                    flexGrow: '1',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        ...theme.typography.body2,
                        color: theme.palette.gray.gray1,
                        wordBreak: 'break-word',
                    }}
                >
                    {option.label}
                </Typography>
                {showIcon && (
                    <CommonTooltip title={option.tooltip}>
                        <Box component="span" sx={{ paddingLeft: '10px', flexShrink: 0, display: 'flex' }}>
                            <InfoSvg />
                        </Box>
                    </CommonTooltip>
                )}
            </Stack>
        </Box>
    );
};

export const SearchField = ({
    options,
    onChange,
    value,
    onInputChange,
    inputValue,
    open,
    onClose,
    onOpen,
    hasError,
    sx,
    id,
    placeholder,
    noOptionsText,
    getOptionLabel,
    filterOptions,
}: SearchFieldProps) => {
    return (
        <Autocomplete
            id={id}
            sx={{
                ...sx,
                backgroundColor: 'white',
                '&:hover': {
                    "& button[title='Clear'] > svg": {
                        display: value?.id ? 'inline-flex' : 'none',
                    },
                },
                "& button[title='Clear'] > svg": {
                    fontSize: '15px',
                    display: 'none',
                },

                '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1px',
                },
            }}
            options={options}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        sx={{
                            '&::-webkit-input-placeholder': {
                                ...theme.typography.body2,
                                color: theme.palette.gray.gray4,
                            },
                        }}
                        placeholder={placeholder}
                        error={hasError}
                        size="small"
                    />
                );
            }}
            // @ts-ignore: ignoring for this time, since no solution
            renderOption={renderOption}
            onChange={onChange}
            value={value}
            inputValue={inputValue}
            onInputChange={onInputChange}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            noOptionsText={noOptionsText}
            getOptionLabel={getOptionLabel}
            filterOptions={filterOptions}
        />
    );
};
