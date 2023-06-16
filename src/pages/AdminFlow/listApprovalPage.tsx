import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Stack, theme, Typography } from '@hiver/hiver-ui-kit';

import { IApproval, IApprover, IStep } from '@gTypes/approvalList';
import { useGetSmApprovalsList } from '@hooks/useGetSmApprovalsList';

import { ReactComponent as CheckSvg } from '@assets/purple_check.svg';
import { ReactComponent as InfoSvg } from '@assets/info.svg';

import { useGetSmApprovers } from '@hooks/useGetSmApprovers';
import { useInputValidator } from '@hooks/useInputValidator';
import { useUpdateApproval } from '@hooks/useUpdateApproval';
import { CommonSwitch } from '@components/CommonSwitch';
import { useGetUgUserDetails } from '@hooks/useGetUgUserDetails';

import { isValidDomainAddress } from '@helper/validators';
import { ConfirmModal } from '@components/Modals/ConfirmModal';
import { useGlobalStore } from './storeContext';
import { ApprovalInfo } from './ApprovalInfo';
import { ApprovalsListSkeleton, CreatedBySkeleton } from './skeleton';
import { getCreatedByUserName, getStepApproversName, validateNameField } from './utils';
import { ApprovalListHeadingEditConent, ApprovalListHeadingViewConent } from './ApprovalHeading';

type StepProps = {
    approvers: IApprover[];
    lastStep?: boolean;
    stepIndex: number;
} & IStep;

const Step = ({ stepIndex, stepApprovers, approvers, lastStep = false }: StepProps) => {
    const listText = useMemo(() => {
        return getStepApproversName(stepApprovers, approvers);
    }, [stepApprovers, approvers]);

    return (
        <Box
            sx={{
                display: 'flex',
                paddingLeft: '18px',
                borderLeft: lastStep ? '' : '1.5px black solid',
                borderColor: 'gray.gray5',
                paddingBottom: '20px',
                position: 'relative',
            }}
        >
            <Stack>
                <Typography
                    sx={{
                        ...theme.typography.caption,
                        color: theme.palette.gray.gray4,
                    }}
                >
                    Step {stepIndex}
                </Typography>
                <Typography
                    sx={{
                        ...theme.typography.body2,
                        color: theme.palette.gray.black,
                    }}
                >
                    {listText}
                </Typography>
            </Stack>
            <Box
                sx={{
                    position: 'absolute',
                    left: '-12px',
                    top: '-1px',
                    width: '25px',
                    height: '25px',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CheckSvg />
            </Box>
        </Box>
    );
};

type ApprovalListDetailProps = {
    steps: IStep[];
    approvers: IApprover[];
    createdBy: string;
    isLoadingCreatedBy?: boolean;
};

const ApprovalListDetail = ({ steps, approvers, createdBy, isLoadingCreatedBy }: ApprovalListDetailProps) => {
    return (
        <Box
            sx={{
                padding: '19px',
            }}
        >
            <Typography
                sx={{
                    ...theme.typography.caption,
                    color: theme.palette.gray.gray3,
                    marginBottom: '15px',
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        gap: '5px',
                        alignItems: 'center',
                    }}
                >
                    Created by {isLoadingCreatedBy ? <CreatedBySkeleton /> : createdBy}
                </Stack>
            </Typography>

            <Stack>
                {steps.map((props: IStep, index) => {
                    return (
                        <Step
                            stepIndex={index + 1}
                            lastStep={steps.length - 1 === index}
                            key={props.stepId}
                            approvers={approvers}
                            {...props}
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};

type ApprovalListHeadingProps = {
    id: string;
    name: string;
    onToggle: (id: string) => void;
    isOpened: boolean;
    isEditMode: boolean;
    toggleEditMode: () => void;
    hasInputError: boolean;
    isArchived: boolean;
    inputProps: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
};

const ApprovalListHeading = ({
    id,
    name,
    onToggle,
    isOpened,
    isEditMode,
    toggleEditMode,
    inputProps,
    hasInputError,
    isArchived,
}: ApprovalListHeadingProps) => {
    const [isConfirmActive, setConfirmStatus] = useState(false);
    const store = useGlobalStore();
    const smId = store?.browserParams.smid || '';
    const { updateApproval, isUpdatingApproval } = useUpdateApproval(id, smId, store ? store.isMocked : false);

    const toggleConfirm = () => {
        setConfirmStatus((val) => !val);
    };

    const onEdit = () => {
        if (isArchived) {
            return;
        }

        if (isOpened) {
            onToggle(id);
        }
        toggleEditMode();
    };

    const onUpdateName = () => {
        if (hasInputError) {
            return;
        }
        updateApproval({
            name: inputProps.value,
            smId: smId || '',
        }).then(() => {
            toggleEditMode();
        });
    };

    const onArchiveApproval = () => {
        updateApproval({
            isActive: false,
            smId: smId || '',
        }).then(() => {
            toggleConfirm();
        });
    };

    return (
        <>
            <Box
                data-testid={`approval_heading_${id}`}
                onClick={() => {
                    if (!isEditMode) {
                        onToggle(id);
                    }
                }}
                sx={{
                    display: 'flex',
                    padding: '12px 12px 12px 19px',
                    alignItems: 'center',
                    minHeight: '54px',
                    justifyContent: 'space-between',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: '1px black solid',
                    borderBottomColor: 'gray.gray5',
                    borderRadius: '5px',
                    borderWidth: isOpened ? '1px' : '0',
                    '&:hover': {
                        backgroundColor: isEditMode ? 'white' : 'gray.gray7',
                        '& .MuiButtonBase-root': !isArchived
                            ? {
                                  display: 'inherit',
                              }
                            : '',
                    },
                }}
            >
                {isEditMode ? (
                    <ApprovalListHeadingEditConent
                        id={name}
                        onCheck={onUpdateName}
                        toggleEditMode={toggleEditMode}
                        inputProps={inputProps}
                        hasError={hasInputError}
                        isLoading={isUpdatingApproval}
                    />
                ) : (
                    <ApprovalListHeadingViewConent
                        isArchived={isArchived}
                        approvalName={name}
                        onEdit={onEdit}
                        toggleConfirm={toggleConfirm}
                    />
                )}
            </Box>

            <ConfirmModal
                open={isConfirmActive}
                onConfirm={(e) => {
                    e.stopPropagation();
                    onArchiveApproval();
                }}
                onClose={(e) => {
                    e.stopPropagation();
                    toggleConfirm();
                }}
                title="Are you sure?"
                showCancelBtn
                footerContent={
                    <Stack direction="row" sx={{ gap: '6px', alignItems: 'center' }}>
                        <InfoSvg
                            style={{
                                width: '16px',
                                height: '16px',
                            }}
                        />
                        This action cannot be undone
                    </Stack>
                }
                maxContentWidth={480}
                description={
                    <Stack
                        sx={{
                            gap: '12px',
                        }}
                    >
                        <span>
                            You will not be able to create new approval requests using this flow. Please confirm if you
                            want to archive this approval flow.
                        </span>
                        <span>
                            <Box component="span" sx={{ fontWeight: '500' }}>
                                Note:{' '}
                            </Box>
                            This action does not affect existing Approval Requests associated with this Approval Flow
                        </span>
                    </Stack>
                }
                btnText="Archive"
                isLoading={isUpdatingApproval}
            />
        </>
    );
};

type ApprovalListItemProps = {
    active?: boolean;
    createdBy: string;
    createdByuserNameOrEmail: string | undefined;
    steps: IStep[];
    approvers: IApprover[];
    allApprovals: IApproval[];
    isDisabled: boolean;
} & Omit<ApprovalListHeadingProps, 'isOpened' | 'inputProps' | 'isEditMode' | 'toggleEditMode' | 'hasInputError'>;

const ApprovalListItem = ({
    name,
    createdBy,
    createdByuserNameOrEmail,
    id,
    steps,
    onToggle,
    approvers,
    allApprovals,
    isArchived = false,
    isDisabled = false,
    active = false,
}: ApprovalListItemProps) => {
    const store = useGlobalStore();
    const [isEditMode, setEditMode] = useState(false);
    const { inputProps, hasError, errorMessage, resetInput, hasInputError } = useInputValidator({
        validator: (value) => validateNameField(value, allApprovals),
        defaultValue: name,
    });

    const isApiEnabled = active && !createdByuserNameOrEmail;

    const { data: ugUserData, status: ugUserDetailStatus } = useGetUgUserDetails(
        createdBy,
        isApiEnabled,
        store?.isMocked || false
    );

    // syncing with the external value to keep the component in consistent state
    useEffect(() => {
        if (isDisabled && isEditMode) {
            setEditMode(false);
            resetInput();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisabled]);

    const toggleEditMode = () => {
        setEditMode((prevVal) => {
            if (prevVal) {
                resetInput();
            }
            return !prevVal;
        });
    };

    const borderColor = useMemo(() => {
        if (isEditMode) {
            if (hasError) {
                return theme.palette.red.primary;
            }
            return theme.palette.blue.primary;
        }
        return theme.palette.gray.gray5;
    }, [isEditMode, hasError]);

    const isLoadingCreatedBy = ugUserDetailStatus === 'loading';
    const hasErrorInUgDetails = ugUserDetailStatus === 'error';

    const nameOrEmail =
        createdByuserNameOrEmail ||
        ugUserData?.firstname ||
        ugUserData?.email ||
        (hasErrorInUgDetails ? '-----' : 'Deleted User');

    const archivedStyles = {
        color: `${theme.palette.gray.gray4} !important`,
        fill: `${theme.palette.gray.gray4} !important`,
    };
    return (
        <Stack>
            <Box
                sx={{
                    border: '1px black solid',
                    borderRadius: '5px',
                    borderColor,
                    '& *': isArchived ? archivedStyles : '',
                }}
            >
                <Stack>
                    <ApprovalListHeading
                        isEditMode={isEditMode}
                        toggleEditMode={toggleEditMode}
                        isOpened={active}
                        id={id}
                        onToggle={onToggle}
                        name={name}
                        inputProps={inputProps}
                        hasInputError={hasInputError}
                        isArchived={isArchived}
                    />
                    {active && (
                        <ApprovalListDetail
                            isLoadingCreatedBy={isLoadingCreatedBy}
                            createdBy={nameOrEmail}
                            approvers={approvers}
                            steps={steps}
                        />
                    )}
                </Stack>
            </Box>
            {isEditMode && hasError && (
                <Typography
                    sx={{
                        ...theme.typography.caption,
                        color: theme.palette.red.primary,
                        marginTop: '5px',
                    }}
                >
                    {errorMessage}
                </Typography>
            )}
        </Stack>
    );
};

export const ListApprovalPage = () => {
    const store = useGlobalStore();
    const { status: approversListStatus, data: approversList } = useGetSmApprovers(
        store?.browserParams.smid || '',
        store?.isMocked || false
    );
    const { status, data: approvalListData } = useGetSmApprovalsList(
        store?.browserParams.smid || '',
        !!approversList,
        store?.isMocked || false
    );

    const domain = store?.domain || '';

    const [activeId, setActiveId] = useState<string>('');

    const isApprovalsEnabled = store ? store.enabled : false;

    const clearActiveId = () => {
        setActiveId('');
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const onToggleEnable = (value: boolean) => {
        if (!isValidDomainAddress(domain) && value == true) {
            setOpenDialog(value);
        } else {
            clearActiveId();
            store?.toggleApprovalInStore(value);
        }
    };

    const toggleId = (newVal: string) => {
        if (!isApprovalsEnabled) {
            return;
        }
        setActiveId((prevVal) => (prevVal === newVal ? '' : newVal));
    };

    const navigateToCreateFlow = () => {
        const path = '/create';
        store && store.navigateInParentWindow(path);
    };

    const isListEmpty = approvalListData && approvalListData.length === 0;

    const renderApprovalList = () => {
        if (approversListStatus === 'loading' || status === 'loading') {
            return <ApprovalsListSkeleton />;
        }

        if (!isApprovalsEnabled && isListEmpty) {
            return <ApprovalInfo type="DISABLED" />;
        }

        if (isListEmpty) {
            return <ApprovalInfo type="EMPTY" />;
        }

        const activeSortedApprovalList = approvalListData
            ? [...approvalListData].sort((a, b) => Number(b.isActive) - Number(a.isActive))
            : null;

        return activeSortedApprovalList
            ? activeSortedApprovalList.map((data) => {
                  const createdByuserNameOrEmail = getCreatedByUserName(approversList || [], data.createdBy);

                  return (
                      <ApprovalListItem
                          onToggle={toggleId}
                          active={activeId === data.id}
                          key={data.id}
                          steps={data.steps}
                          name={data.name}
                          createdBy={data.createdBy}
                          createdByuserNameOrEmail={createdByuserNameOrEmail}
                          id={data.id}
                          approvers={approversList || []}
                          allApprovals={activeSortedApprovalList}
                          isDisabled={!isApprovalsEnabled}
                          isArchived={!data.isActive}
                      />
                  );
              })
            : null;
    };

    if (status === 'error' || approversListStatus === 'error') {
        return <h3>Something went wrong ...</h3>;
    }

    const approvalsList = renderApprovalList();

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    color: 'gray.black',
                }}
            >
                <Typography
                    sx={{
                        ...theme.typography.h3,
                        color: theme.palette.gray.black,
                    }}
                >
                    Approvals
                </Typography>

                <Stack
                    sx={{
                        alignItems: 'center',
                    }}
                    direction="row"
                    spacing={2}
                >
                    <CommonSwitch
                        label="approval_toggle"
                        showLabel={false}
                        checked={isApprovalsEnabled}
                        onChange={onToggleEnable}
                    />
                    <ConfirmModal
                        open={openDialog}
                        onConfirm={handleCloseDialog}
                        onClose={handleCloseDialog}
                        title="Almost there!"
                        description={
                            <>
                                Unfortunately, we could not recognize a valid domain for your account. Please reach out
                                to{' '}
                                <a className="h-link-col" href="mailto:support@hiverhq.com">
                                    support@hiverhq.com
                                </a>{' '}
                                to rectify this. Thank you.
                            </>
                        }
                        btnColor={theme.palette.blue.primary}
                        btnText="okay"
                    />
                    <Button
                        disableElevation
                        onClick={navigateToCreateFlow}
                        disabled={!isApprovalsEnabled}
                        sx={{
                            backgroundColor: theme.palette.blue.primary,
                            fontSize: '13px',
                            padding: '4px 13px',
                            textTransform: 'capitalize',
                            '&:hover': {
                                boxShadow: 'none',
                            },
                        }}
                        variant="contained"
                    >
                        <Typography
                            sx={{
                                ...theme.typography.buttonMedium,
                            }}
                        >
                            Create Approval Flow
                        </Typography>
                    </Button>
                </Stack>
            </Box>
            <Stack
                role="list"
                sx={{
                    filter: !isApprovalsEnabled && !isListEmpty ? 'blur(2px)' : '',
                    pointerEvents: !isApprovalsEnabled && !isListEmpty ? 'none' : '',
                }}
                spacing={2}
            >
                {approvalsList}
            </Stack>
        </>
    );
};
