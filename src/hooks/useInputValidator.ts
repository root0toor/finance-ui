import React, { useEffect, useState } from 'react';

type inputProps = {
    validator: (value: string) => { hasError: boolean; message: string };
    defaultValue?: string;
};

export const useInputValidator = ({ validator, defaultValue }: inputProps) => {
    const [value, setValue] = useState(defaultValue || '');
    const [onceFocused, setFocus] = useState(false);

    const resetInput = () => {
        setFocus(false);
        setValue(defaultValue || '');
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setFocus(true);
    };

    const validateField = () => {
        setFocus(true);
        return validator(value).hasError;
    };

    useEffect(() => {
        resetInput();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    const { hasError: inputError, message } = validator(value);

    const hasError = onceFocused && inputError;
    const errorMessage = onceFocused ? message : '';

    return {
        inputProps: {
            value,
            onChange,
        },
        setValue,
        validateField,
        hasInputError: inputError, // this error is active without even focusing the input
        hasError, // this error will only be active once the input is focused
        errorMessage, // this error message will only be active once the input is focused
        resetInput,
    };
};
