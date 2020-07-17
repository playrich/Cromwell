import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData, getStoreItem } from '@cromwell/core';

export const CPlugin = (props: { id: string, className?: string, pluginName?: string }) => {
    const { pluginName, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(props) => {
                const name = (props.data && props.data.pluginName) ? props.data.pluginName : pluginName;
                let PluginComponent;
                if (name) {
                    const importDynamicPlugin = getStoreItem('importDynamicPlugin');
                    if (importDynamicPlugin) {
                        PluginComponent = importDynamicPlugin(name);
                    }
                }
                if (PluginComponent) return (
                    <ErrorBoundary>
                        <PluginComponent />
                    </ErrorBoundary>
                );
                else return <></>
            }}
        />
    )
}

class ErrorBoundary extends React.Component<{}, { hasError: boolean, errorMessage: string }> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: JSON.stringify(error) };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h3>Plugin crashed</h3>
                    <p>{this.state.errorMessage}</p>
                </div>
            );
        }

        return this.props.children;
    }
};
