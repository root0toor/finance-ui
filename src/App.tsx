import { useEffect } from 'react';
import { setAppConfig } from '@helper/api';
import { createListnerToListenFromOuterWorld } from '@helper/globalListner';
import { Box, Stack } from '@hiver/hiver-ui-kit';
import { ApprovalsConfigurationPanel } from '@pages/AdminFlow';
import { ApprovalSelectionConfiguration } from '@pages/ExtensionFlow';

setAppConfig('https://www.v2.com', 'https://www.abcd.com', 'temp');

function App() {
    // listning to all outer events ---
    useEffect(() => {
        createListnerToListenFromOuterWorld();
    }, []);
    return (
        <Stack direction="row">
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                }}
            >
                <ApprovalsConfigurationPanel
                    domain="hiver.space"
                    userId="1"
                    isMocked={true}
                    smUsers={[
                        {
                            email: 'avatar@gmail.com',
                            userid: '1',
                            firstname: 'user',
                            lastname: '',
                        },
                    ]}
                    onNavigate={() => {
                        //TODO
                    }}
                    browserLocation={{
                        state: '',
                        key: '',
                        pathname: '',
                        search: '',
                        hash: '',
                    }}
                    browserParams={{
                        smid: '1',
                    }}
                    enabled={true}
                    toggleApprovals={(status: boolean) => {
                        return new Promise((res) => {
                            setTimeout(() => {
                                res(status);
                            }, 3000);
                        });
                    }}
                />
            </Box>
            <Box
                sx={{
                    width: '278px',
                }}
            >
                <ApprovalSelectionConfiguration
                    closeInfoPopper={() => {
                        return;
                    }}
                    userId="1"
                    isMocked={true}
                    conversationId="1"
                    smId="1"
                />
            </Box>
        </Stack>
    );
}

export default App;
