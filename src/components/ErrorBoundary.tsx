import React from 'react';

type ErrorBoundaryProps = {
    children: React.ReactElement | React.ReactNode;
    fallback: React.ReactElement;
};

type ErrorState = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    componentDidCatch(error: unknown, errorInfo: unknown) {
        console.error(error, errorInfo); // eslint-disable-line no-console
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}
