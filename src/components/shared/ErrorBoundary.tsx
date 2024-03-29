import React, {ErrorInfo} from 'react';
import ErrorX from "./ErrorX";

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: {}) {
        // @ts-ignore
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {    // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {    // You can also log the error to an error reporting service
        // console.error(error, errorInfo);
        console.error(error);
    }

    render() {
        if (this.state.hasError) {    // You can render any custom fallback UI
            // return <h1>Something went wrong.</h1>;\
            return <ErrorX></ErrorX>
        }
        return this.props.children;
    }
}
