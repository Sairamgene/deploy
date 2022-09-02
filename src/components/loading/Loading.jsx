import React from 'react';
import { ProgressCircle, Provider as SpectrumProvider, defaultTheme, Flex } from '@adobe/react-spectrum';

const Loading = () => {
    return (
        <SpectrumProvider theme={defaultTheme}>
            <Flex alignItems="center" justifyContent="center" height="100vh">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </Flex>
        </SpectrumProvider>
    )
}

export default Loading
