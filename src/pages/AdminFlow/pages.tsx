import { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@hiver/hiver-ui-kit';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { CommonErrorFallback } from '@components/Fallbacks/CommonErrorFallback';
import { PromptModalType } from '@gTypes/approvalList';
import { CreateApprovalPage } from './createApprovalPage';
import { ListApprovalPage } from './listApprovalPage';

export const AdminFlowPages = ({
    navigationPrompt,
    navigationPromtModal,
}: {
    navigationPrompt?: ReactElement;
    navigationPromtModal?: PromptModalType;
}) => {
    return (
        <Box
            sx={{
                width: '100%',
                padding: '15px 117px 20px 43px',
                position: 'absolute',
                inset: '0',
                overflowY: 'auto',
            }}
        >
            <Routes>
                <Route
                    index
                    element={
                        <ErrorBoundary fallback={<CommonErrorFallback />}>
                            <ListApprovalPage />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <ErrorBoundary fallback={<CommonErrorFallback />}>
                            <CreateApprovalPage
                                navigationPrompt={navigationPrompt}
                                navigationPromtModal={navigationPromtModal}
                            />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/edit/:approvalId"
                    element={
                        <ErrorBoundary fallback={<CommonErrorFallback />}>
                            <CreateApprovalPage
                                navigationPrompt={navigationPrompt}
                                navigationPromtModal={navigationPromtModal}
                            />
                        </ErrorBoundary>
                    }
                />
            </Routes>
        </Box>
    );
};
