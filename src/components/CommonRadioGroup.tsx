import React from 'react';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    theme,
} from '@hiver/hiver-ui-kit';

type radioProps = {
    value: string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: { label: string; value: string }[];
    label?: string;
    helperText?: string;
    error?: boolean;
};

export const CommonRadioGroup = ({ value, onChange, id, options, label, helperText, error }: radioProps) => {
    return (
        <FormControl error={error}>
            {label && (
                <FormLabel
                    sx={{
                        ...theme.typography.h4,
                        color: theme.palette.gray.black,
                        '&.Mui-focused': {
                            color: theme.palette.gray.black,
                        },
                    }}
                    id={id}
                >
                    {label}
                </FormLabel>
            )}
            <RadioGroup
                sx={{
                    '& .MuiButtonBase-root:not(.Mui-checked)': {
                        color: theme.palette.gray.gray4,
                    },
                    '& .MuiButtonBase-root': {
                        padding: '8px',
                    },
                }}
                aria-labelledby={id}
                name={`${id}_radio_name`}
                value={value}
                onChange={onChange}
            >
                {options.map((item) => {
                    return (
                        <FormControlLabel
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    ...theme.typography.body2,
                                    color: theme.palette.gray.black,
                                },
                            }}
                            key={item.value}
                            value={item.value}
                            control={<Radio id={item.value} />}
                            label={item.label}
                        />
                    );
                })}
            </RadioGroup>
            {helperText && (
                <FormHelperText
                    sx={{
                        '&.MuiFormHelperText-root': {
                            marginLeft: '0px',
                        },
                    }}
                >
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};
