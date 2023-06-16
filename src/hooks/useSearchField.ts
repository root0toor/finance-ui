import { TapproverValue } from '@pages/AdminFlow/FormContext';
import React, { useState } from 'react';

type InputProps = {
    value: TapproverValue | null | undefined;
    onChangeData: (value: TapproverValue | null) => void;
    validator: (value: TapproverValue | null | undefined) => boolean;
};

export const useSearchField = ({ validator, value, onChangeData }: InputProps) => {
    const [onceFocused, setFocus] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setOpen] = useState(false);

    const onChange = (event: React.SyntheticEvent, newInputValue: TapproverValue | null) => {
        onChangeData(newInputValue);
        setFocus(true);
    };

    const onInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

    const validateField = (shouldFocus = true) => {
        setFocus(shouldFocus);
        return validator(value);
    };

    const hasError = onceFocused && !validator(value);

    return {
        inputProps: {
            value: value || null,
            inputValue,
            onChange,
            onInputChange,
            onOpen,
            onClose,
            open: isOpen,
            hasError,
        },
        validateField,
    };
};
