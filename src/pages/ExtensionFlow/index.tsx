import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CommonSelect } from '@components/CommonSelect';
import { IApprovalProcessFormData, IApprovalRquestDetail, TApprovalStatus } from '@gTypes/applyApproval';
import { Box, Stack, Typography, theme, SelectChangeEvent, ButtonBase, HiverThemeProvider } from '@hiver/hiver-ui-kit';
import { useGetSmApprovalsList } from '@hooks/useGetSmApprovalsList';
import { useGetApprovalRequestDetails } from '@hooks/useGetApprovalRequestDetails';
import { useCreateApprovalRequest } from '@hooks/useCreateApprovalRequest';
import { useProcessApprovalRequest } from '@hooks/useProcessApprovalRequest';
import { AppQueryClientProvider } from '@queryClients/appQueryClient';
import { ConfirmModal } from '@components/Modals/ConfirmModal';
import { setAppUserId } from '@helper/api';
import { CommonSnackbar } from '@components/CommonSnackBar';
import { createListnerToListenFromOuterWorld } from '@helper/globalListner';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { CommonErrorFallback } from '@components/Fallbacks/CommonErrorFallback';

import { ReactComponent as RightArrowSvg } from '@assets/right_arrow.svg';
import { ReactComponent as LeftArrowSvg } from '@assets/left_arrow.svg';

import { ApprovalStatus } from './ApprovalStatus';
import { ApprovalStep } from './ApprovalStep';
import { ApprovalResponse } from './ApprovalResponse';
import { ApprovalInfoBar } from './ApprovalInfo';
import { ApprovalBadgeSkeleton, ApprovalSelectSkeleton, StepsSkeleton } from './skeleton';
import { OnboardPopper } from './OnboardPopper';
import { SmHeader } from './SmHeader';

type ApprovalStepsProps = {
    steps: IApprovalRquestDetail[];
    disabled?: boolean;
    currentStepId: number;
};

const SCROLL_BY = 69;
const ACTION_BTN_SIZE = 20;

const TooltipDetails = ({ text }: { text: string }) => {
    const detailsRows = useMemo(() => {
        return text.split('<br/>').map((item, idx) => (
            <span key={`${item}_${idx}`} style={{ display: 'block' }}>
                {item}
            </span>
        ));
    }, [text]);
    return <Stack spacing={0}>{detailsRows}</Stack>;
};

const ApprovalSteps = ({ steps, disabled, currentStepId }: ApprovalStepsProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const leftArrowRef = useRef<HTMLButtonElement | null>(null);
    const rightArrowRef = useRef<HTMLButtonElement | null>(null);

    const toggleLeftArrow = () => {
        const hasSpaceToScrollInLeft = containerRef.current ? containerRef.current.scrollLeft > 0 : false;
        if (leftArrowRef.current) {
            leftArrowRef.current.style.display = hasSpaceToScrollInLeft ? 'flex' : 'none';
        }
    };
    const toggleRightArrow = () => {
        const ScrollBarWidth = 17; // specifically for windows
        const hasSpaceToScrollInRight = containerRef.current
            ? containerRef.current.scrollLeft + containerRef.current?.clientWidth + ScrollBarWidth <
              containerRef.current.scrollWidth
            : false;
        if (rightArrowRef.current) {
            rightArrowRef.current.style.display = hasSpaceToScrollInRight ? 'flex' : 'none';
        }
    };

    const toggleBothArrows = () => {
        //setting the timeout so that the scroll should happen before reading the value
        setTimeout(() => {
            toggleLeftArrow();
            toggleRightArrow();
        }, 500);
    };

    const scrollToRight = () => {
        const scrollBy = containerRef.current ? containerRef.current.scrollLeft + SCROLL_BY : 0;
        if (containerRef.current && typeof containerRef.current.scroll === 'function') {
            containerRef.current.scroll(scrollBy, 0);
        }
        toggleBothArrows();
    };
    const scrollToLeft = () => {
        const scrollBy = containerRef.current ? containerRef.current.scrollLeft - SCROLL_BY : 0;
        if (containerRef.current && typeof containerRef.current.scroll === 'function') {
            containerRef.current.scroll(scrollBy, 0);
        }
        toggleBothArrows();
    };

    // used to sync the scroll position with the current step being in progress
    useEffect(() => {
        let stepIndex = -1;
        // looping from back since stepId cannot be always unique
        for (let i = steps.length - 1; i >= 0; i--) {
            const { stepId } = steps[i];
            if (stepId === currentStepId) {
                stepIndex = i;
                break;
            }
        }

        if (stepIndex > -1) {
            const amountToScroll = stepIndex * SCROLL_BY;
            const clientWidth = containerRef.current?.clientWidth || 0;
            if (amountToScroll <= clientWidth) {
                toggleBothArrows();
                return;
            }
            if (containerRef.current && typeof containerRef.current.scroll === 'function') {
                containerRef.current.scroll(amountToScroll - ACTION_BTN_SIZE, 0);
                // only after scrolling we are toggling the style of arrows
                toggleBothArrows();
            }
        } else {
            if (containerRef.current && typeof containerRef.current.scroll === 'function') {
                // scroll to end in case of approved or rejected state
                containerRef.current.scroll(1000 * 500, 0);
            }
            toggleBothArrows();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStepId, steps]);

    const list = useMemo(() => {
        const result = [];
        let initStepCount = 0;
        for (const step of steps) {
            const initStep = step.status === 'INITIATED';
            if (initStep) {
                initStepCount++;
            }

            const showDivider = !initStep ? true : initStepCount > 1;

            result.push(
                <ApprovalStep
                    disabled={disabled || step.isCancelled}
                    key={`${step.id}_${step.stepId}_${step.status}`}
                    type={step.status}
                    showDivider={showDivider}
                    details={<TooltipDetails text={step.statusDetails} />}
                />
            );
        }
        return result;
    }, [steps, disabled]);

    const baseStyle = {
        position: 'absolute',
        top: '0%',
        width: `${ACTION_BTN_SIZE}px`,
        height: `${ACTION_BTN_SIZE}px`,
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    };
    return (
        <Box
            sx={{
                position: 'relative',
                isolation: 'isolate',
            }}
        >
            <Stack
                ref={containerRef}
                direction="row"
                sx={{
                    overflow: 'hidden',
                    scrollBehavior: 'smooth',
                }}
            >
                {list}

                <ButtonBase
                    ref={leftArrowRef}
                    onClick={scrollToLeft}
                    sx={{
                        left: 0,
                        ...baseStyle,
                    }}
                >
                    <LeftArrowSvg />
                </ButtonBase>

                <Box>
                    <ButtonBase
                        ref={rightArrowRef}
                        onClick={scrollToRight}
                        sx={{
                            right: 0,
                            ...baseStyle,
                        }}
                    >
                        <RightArrowSvg />
                    </ButtonBase>
                </Box>
            </Stack>
        </Box>
    );
};

type SelectApprovalProps = {
    currentApproval: string;
    approvalType: TApprovalStatus | '';
    onChange: (e: SelectChangeEvent<unknown>) => void;
    options: { label: string; value: string }[];
    isLoadingApprovals: boolean;
    isLoadingDetails: boolean;
    isRefetchingAndLoadingDetails: boolean;
    onCancelApproval: (value: string, callback: () => void) => void;
    showCancelBtn?: boolean;
    isCancellingApproval?: boolean;
    isCollabSpace: boolean;
    isModuleDisabled: boolean;
};

const SelectApproval = ({
    currentApproval,
    approvalType,
    onChange,
    options,
    isLoadingApprovals,
    isLoadingDetails,
    isRefetchingAndLoadingDetails,
    onCancelApproval,
    showCancelBtn,
    isCancellingApproval,
    isCollabSpace,
    isModuleDisabled,
}: SelectApprovalProps) => {
    const [isConfirmModalActive, setConfirmModalStatus] = useState(false);

    const toggleConfirmModal = () => {
        setConfirmModalStatus((val) => !val);
    };

    const onCancel = () => {
        toggleConfirmModal();
    };
    const onConfirm = () => {
        onCancelApproval(currentApproval, toggleConfirmModal);
    };

    const renderBadge = () => {
        if (isRefetchingAndLoadingDetails) {
            return <ApprovalBadgeSkeleton />;
        }
        return (
            !isModuleDisabled && approvalType && approvalType !== 'CANCELLED' && <ApprovalStatus type={approvalType} />
        );
    };

    const badge = !isCollabSpace ? renderBadge() : null;

    return (
        <Stack spacing={1}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    role="heading"
                    sx={{
                        ...theme.typography.caption,
                    }}
                    color={theme.palette.gray.gray3}
                >
                    Approval
                </Typography>
                {badge}
            </Box>
            {!isCollabSpace && (
                <Box>
                    {isLoadingApprovals || isLoadingDetails ? (
                        <ApprovalSelectSkeleton />
                    ) : (
                        <CommonSelect
                            id="approval_select"
                            defaultValue=""
                            placeholder="Select Approval flow"
                            value={currentApproval}
                            onChange={onChange}
                            emptyText="No Approval Flows Found "
                            sx={{
                                minWidth: currentApproval ? 'auto' : '120px',
                            }}
                            options={options}
                            onCancel={onCancel}
                            cancelButtonTooltip="Cancel approval"
                            showCancelBtn={showCancelBtn}
                            disabled={!!(currentApproval || isModuleDisabled)}
                        />
                    )}
                </Box>
            )}
            <ConfirmModal
                open={isConfirmModalActive}
                onConfirm={onConfirm}
                onClose={onCancel}
                title="Cancel Approval Request?"
                description="Are you sure you want to cancel the Approval Request on this conversation?"
                btnText="Confirm"
                isLoading={isCancellingApproval}
            />
        </Stack>
    );
};

type ApprovalSelectionProps = {
    smId: string;
    conversationId: string;
    infoGuider: React.ReactNode | null;
    moduleDisabled?: boolean;
    isMocked?: boolean;
    isCollabSpace?: boolean;
    smName?: string;
};

const ApprovalSelection = ({
    smId,
    conversationId,
    moduleDisabled,
    infoGuider,
    smName = '',
    isCollabSpace = false,
    isMocked = false,
}: ApprovalSelectionProps) => {
    const [currentApproval, setApproval] = useState('');
    const { status, data: approvalsList, error: approverListError } = useGetSmApprovalsList(smId, true, isMocked);
    const {
        status: detailsStatus,
        data: requestDetails,
        error: requestDetailsError,
        refetch: refetchReqDetails,
        isRefetching: isRefetchingRequestDetails,
    } = useGetApprovalRequestDetails(conversationId, smId, isMocked);
    const { createApprovalRequest, isCreatingApprovalRequest } = useCreateApprovalRequest(isMocked, (type) => {
        if (type === 'success') {
            refetchReqDetails();
        } else if (type === 'failed') {
            setApproval('');
        }
    });

    const { processApprovalRequest, isProcessingApprovalRequest, currentApprovalProcessType } =
        useProcessApprovalRequest(isMocked, (type) => {
            if (type === 'success') {
                refetchReqDetails();
            }
        });

    const onProcessApproval = (data: Omit<IApprovalProcessFormData, 'approvalRequestId'>) => {
        processApprovalRequest({
            approvalRequestId: requestDetails ? String(requestDetails.approvalRequestId) : '',
            status: data.status,
            reason: data.reason,
            note: data.note,
        });
    };

    const onChangeApproval = (e: SelectChangeEvent<unknown>) => {
        const elem = e as React.ChangeEvent<HTMLInputElement>;
        const val = elem.target.value;
        setApproval(val);
        createApprovalRequest({
            conversationId,
            smId,
            approvalFlowId: val,
        });
    };

    const cancelApproval = (value: string, callback: () => void) => {
        processApprovalRequest({
            approvalRequestId: requestDetails ? String(requestDetails.approvalRequestId) : '',
            status: 'CANCELLED',
            reason: '',
            note: '',
        }).then(() => {
            callback();
            setApproval('');
        });
    };

    useEffect(() => {
        const approval = approvalsList?.find((item) => Number(item.id) === requestDetails?.approvalFlowId);
        const status = requestDetails?.status;
        if (status === 'REJECTED') {
            setApproval('');
        } else if (approval && status !== 'CANCELLED') {
            setApproval(approval.id);
        }
    }, [requestDetails, approvalsList]);

    const approvalsOptions = useMemo(() => {
        return approvalsList
            ? approvalsList.map((item) => ({ label: item.name, value: item.id, hidden: !item.isActive }))
            : [];
    }, [approvalsList]);

    const approvalStates: TApprovalStatus[] = ['APPROVED', 'REJECTED', 'CANCELLED'];

    const isDetailsFetchSuccess = detailsStatus === 'success';
    const isLoadingApprovals = status === 'loading';
    const isLoadingDetails = detailsStatus === 'loading';
    const isRefetchingAndLoadingDetails = isLoadingDetails || isRefetchingRequestDetails || isCreatingApprovalRequest;
    const isDetailsSuccess = isDetailsFetchSuccess && requestDetails;
    const hasApprovalSelected = !!currentApproval;

    const showRequestDeatils = !isCreatingApprovalRequest && !isRefetchingAndLoadingDetails && isDetailsSuccess;

    const showSteps = !!showRequestDeatils;
    const showResponse = showRequestDeatils && hasApprovalSelected && !approvalStates.includes(requestDetails.status);
    const showInfo = showRequestDeatils && requestDetails.statusDetails;

    const showSmHeader = !!(isCollabSpace && smName);

    const collabsSpaceContainerStyles = {
        marginBottom: '25px',
        borderBottom: '1px black solid',
        borderColor: '#D8D8D8',
    };

    if (approverListError || requestDetailsError) {
        return (
            <Typography
                sx={{
                    ...theme.typography.caption,
                    color: theme.palette.red.primary,
                    padding: '20px 11px',
                }}
            >
                Something went wrong ...
            </Typography>
        );
    }

    //  in case of collab-space we dont want to show the loading state
    if ((isCollabSpace || moduleDisabled) && !requestDetails) {
        return null;
    }

    return (
        <>
            {showSmHeader && <SmHeader smName={smName} />}
            <Box
                sx={{
                    ...(showSmHeader ? collabsSpaceContainerStyles : {}),
                }}
            >
                <Stack
                    sx={{
                        padding: '20px 11px',
                        transform: showSmHeader ? 'translateX(-10px)' : '',
                    }}
                    spacing={2.5}
                >
                    <SelectApproval
                        isCollabSpace={isCollabSpace}
                        approvalType={requestDetails ? requestDetails.status : ''}
                        currentApproval={currentApproval}
                        onChange={onChangeApproval}
                        options={approvalsOptions}
                        isRefetchingAndLoadingDetails={isRefetchingAndLoadingDetails}
                        isLoadingDetails={isLoadingDetails}
                        isLoadingApprovals={isLoadingApprovals}
                        onCancelApproval={cancelApproval}
                        isModuleDisabled={!!moduleDisabled}
                        showCancelBtn={!moduleDisabled && !!(requestDetails && requestDetails.status !== 'APPROVED')}
                        isCancellingApproval={isProcessingApprovalRequest && currentApprovalProcessType === 'CANCELLED'}
                    />
                    {isRefetchingAndLoadingDetails && <StepsSkeleton />}
                    {showSteps && (
                        <ApprovalSteps
                            currentStepId={requestDetails.currentStepId}
                            disabled={moduleDisabled}
                            steps={requestDetails.approvalRequestDetails}
                        />
                    )}
                    {!moduleDisabled && showResponse && requestDetails?.isApprover && (
                        <ApprovalResponse
                            onApprove={onProcessApproval}
                            onReject={onProcessApproval}
                            isLoading={
                                isProcessingApprovalRequest &&
                                (currentApprovalProcessType === 'APPROVED' || currentApprovalProcessType === 'REJECTED')
                            }
                        />
                    )}
                    {showInfo && <ApprovalInfoBar message={requestDetails.statusDetails} />}
                </Stack>
            </Box>
            {!moduleDisabled && isDetailsFetchSuccess && infoGuider}
        </>
    );
};

type ApprovalSelectionConfigurationProps = {
    showInfoPopper?: boolean;
    closeInfoPopper?: () => void;
    userId: string;
} & Omit<ApprovalSelectionProps, 'infoGuider'>;

export const ApprovalSelectionConfiguration = ({
    conversationId,
    smId,
    smName,
    moduleDisabled,
    userId,
    closeInfoPopper,
    isCollabSpace = false,
    showInfoPopper = false,
    isMocked = false,
}: ApprovalSelectionConfigurationProps) => {
    const containerRef = useRef<HTMLDivElement>();

    // configuring the app user id
    setAppUserId(userId);

    // listning to all outer events
    useEffect(() => {
        if (import.meta.env.PROD) {
            createListnerToListenFromOuterWorld();
        }
    }, []);

    return (
        <ErrorBoundary fallback={<CommonErrorFallback />}>
            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    position: 'relative',
                }}
            >
                <HiverThemeProvider>
                    <AppQueryClientProvider>
                        <ApprovalSelection
                            conversationId={conversationId}
                            smId={smId}
                            moduleDisabled={moduleDisabled}
                            isMocked={isMocked}
                            isCollabSpace={isCollabSpace}
                            smName={smName}
                            infoGuider={
                                <OnboardPopper
                                    dimensions={() => {
                                        const dim = containerRef.current?.getBoundingClientRect();
                                        const currentRight = dim?.right;
                                        const rightFromEdge = window.innerWidth - (currentRight || 0);
                                        const totalRight = (dim?.width || 0) + rightFromEdge;
                                        return {
                                            right: totalRight || 0,
                                            top: (dim?.top || 0) - 30,
                                        };
                                    }}
                                    open={showInfoPopper}
                                    onClose={
                                        closeInfoPopper
                                            ? closeInfoPopper
                                            : () => {
                                                  return;
                                              }
                                    }
                                />
                            }
                        />
                    </AppQueryClientProvider>
                    <CommonSnackbar />
                </HiverThemeProvider>
            </Box>
        </ErrorBoundary>
    );
};
