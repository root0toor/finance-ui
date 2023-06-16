import { useRef, useState } from 'react';
import ReactDom from 'react-dom';
import { Snackbar, theme } from '@hiver/hiver-ui-kit';
import { ReactComponent as HiverLogoSvg } from '@assets/hiver_tooltip_logo.svg';
type snackProps = {
    message: string;
    autoHideAfter: number;
    type: 'info' | 'error' | 'warning' | 'success' | undefined;
};

let snackbarCaller: (data: snackProps) => void | null;

export const showSnackbar = (data: snackProps) => {
    snackbarCaller && snackbarCaller(data);
};

export const CommonSnackbar = () => {
    const [snackBarData, setSnackbarData] = useState<snackProps | null>();
    const timerRef = useRef<unknown>();
    const [isOpen, setOpen] = useState(false);

    const activateTimer = (data: snackProps) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current as number);
        }
        setOpen(true);
        timerRef.current = setTimeout(() => {
            setOpen(false);
        }, data.autoHideAfter);
    };

    const onShow = (data: snackProps) => {
        setSnackbarData(data);
        activateTimer(data);
    };
    snackbarCaller = onShow;
    const tooltipStyle =
        snackBarData?.type === 'info'
            ? {
                  '&.MuiAlert-root': {
                      backgroundColor: '#343C45',
                      color: 'white',
                  },
                  '&>.MuiAlert-icon ': {
                      color: 'white',
                  },
              }
            : {};

    return ReactDom.createPortal(
        <Snackbar
            message={snackBarData?.message}
            open={isOpen}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            AlertProps={{
                severity: 'info',
                color: snackBarData?.type,
                icon: <HiverLogoSvg />,
                sx: {
                    ...theme.typography.body2,
                    ...tooltipStyle,
                },
            }}
        />,
        document.body
    );
};
