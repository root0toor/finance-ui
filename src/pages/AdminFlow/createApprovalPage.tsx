import React, { useEffect, useMemo, useState } from 'react';

import { SearchField, SearchFieldoption } from '@components/SearchField';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Stack,
    styled,
    TextField,
    theme,
    Typography,
} from '@hiver/hiver-ui-kit';

import { ReactComponent as CheckSvg } from '@assets/purple_check.svg';
import { ReactComponent as BackArrowSvg } from '@assets/back_arrow.svg';

import { useInputValidator } from '@hooks/useInputValidator';
import { useSearchField } from '@hooks/useSearchField';
import { useCreateApproval } from '@hooks/useCreateApproval';
import { StepBody } from '@gTypes/approvalCreate';
import { useGetSmApprovers } from '@hooks/useGetSmApprovers';
import { IApprover, PromptModalType } from '@gTypes/approvalList';
import { CrossButton } from '@components/Buttons/CrossButton';
import { useGetSmApprovalsList } from '@hooks/useGetSmApprovalsList';
import { isValidEmail } from '@helper/validators';

import { getAllSelectedApproverIds, isApproversFormValid, validateNameField, validateNonEmptyText } from './utils';
import { useGlobalStore } from './storeContext';
import { FormProvider, Tapprover, TapproverValue, useFormActions, useFormStore } from './FormContext';
import { NoOptionsText } from './NoOptionsText';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            '&.Mui-error.Mui-focused fieldset': {
                borderColor: '#CD3746',
            },
        },

        '&:hover': {
            '&.Mui-error fieldset': {
                borderColor: '#CD3746',
            },
        },

        '&.Mui-focused': {
            '& fieldset': {
                borderWidth: '1px',
            },
            '&.Mui-error fieldset': {
                borderColor: '#CD3746',
            },
        },
    },
});

const Header = ({ onGoBack }: { onGoBack: () => void }) => {
    return (
        <Box
            sx={{
                color: '4D6370',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <IconButton
                data-testid="back_btn"
                onClick={onGoBack}
                sx={{
                    p: 0,
                    width: '30px',
                    height: '30px',
                    position: 'absolute',
                    left: '-40px',
                }}
            >
                <BackArrowSvg
                    style={{
                        width: '13px',
                        height: '13px',
                    }}
                />
            </IconButton>
            <Typography
                role="heading"
                sx={{
                    ...theme.typography.body1_medium,
                }}
                color="#4D6370"
            >
                Create Approval Flow
            </Typography>
        </Box>
    );
};

type inputAreaProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | undefined;
    hasError: boolean;
    errorMessage?: string;
};
const InputArea = ({ onChange, value, hasError, errorMessage }: inputAreaProps) => {
    return (
        <Stack
            sx={{
                maxWidth: '467px',
                marginBottom: '40px',
            }}
            spacing={1}
        >
            <Typography
                component="label"
                sx={{
                    ...theme.typography.caption,
                }}
                color={theme.palette.gray.gray1}
            >
                Flow name
            </Typography>
            <StyledTextField
                sx={{
                    '& .MuiFormHelperText-root': {
                        marginLeft: 0,
                    },
                }}
                inputProps={{
                    maxLength: 30,
                }}
                error={hasError}
                onChange={onChange}
                value={value}
                size="small"
                id="flow_name"
                variant="outlined"
                placeholder="Eg. Marketing expense"
                helperText={errorMessage}
            />
        </Stack>
    );
};

type stepApproverProps = {
    approversList: IApprover[];
    stepNumber: number;
    approverId: number;
    value: TapproverValue | null | undefined;
    isFirstApprover: boolean;
};
const StepApprover = ({ approverId, stepNumber, value, approversList, isFirstApprover }: stepApproverProps) => {
    const store = useGlobalStore();
    const domain = store?.domain || '';
    const { changeApproverValue, clearApprover } = useFormActions();
    const { steps } = useFormStore();
    const { inputProps } = useSearchField({
        validator: validateNonEmptyText,
        value,
        onChangeData: (newVal) => changeApproverValue(stepNumber, approverId, newVal),
    });

    const getFilteredApprovers = () => {
        const allSelectedIds = getAllSelectedApproverIds(steps);
        const fileteredData =
            allSelectedIds.length > 0
                ? approversList.filter((approver) => !allSelectedIds.includes(approver.id))
                : approversList;
        return fileteredData;
    };
    const renderLabel = (option: SearchFieldoption) => {
        const label = option.label;
        // we are splitting the lable because we have added an option with the label like - `Invite ${typedEmail} as an Approver` see useMemo approversOptionsWithNewInvitees
        return label.includes('Invite') ? `Invited(${option.label.split('`')[1]})` : label;
    };

    const filterdApprovers = getFilteredApprovers();

    const approversOptions = useMemo(() => {
        return filterdApprovers
            .filter((approver) => approver.email.endsWith(`@${domain}`))
            .map((approver) => ({
                label: approver.firstname || approver.email,
                id: approver.id,
                email: approver.email,
                tooltip: '',
            }));
    }, [filterdApprovers, domain]);

    const approversOptionsWithNewInvitees = useMemo(() => {
        let newOptions = [...approversOptions];
        const typedEmail = inputProps ? inputProps.inputValue : '';
        const isEmailAddressValid = isValidEmail(typedEmail);
        const isEmailAddressPartOfSystem = approversList.find((item) => item.email.includes(typedEmail));
        const isSameDomain = typedEmail.endsWith(`@${domain}`);

        if (isEmailAddressValid) {
            if (!isEmailAddressPartOfSystem && isSameDomain) {
                newOptions = [
                    {
                        label: `Invite \`${typedEmail}\` as an Approver`,
                        id: typedEmail,
                        email: typedEmail,
                        tooltip: 'Approver accounts are free of charge',
                    },
                    ...newOptions,
                ];
            }
        }

        return newOptions;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approversOptions, inputProps.inputValue, approversList]);

    return (
        <Stack
            sx={{
                marginBottom: '14px',
            }}
            spacing={1}
        >
            {isFirstApprover && (
                <Typography
                    sx={{
                        ...theme.typography.caption,
                    }}
                    color={theme.palette.gray.gray3}
                >
                    Approver is
                </Typography>
            )}
            <Stack
                direction="row"
                sx={{
                    alignItems: 'center',
                }}
            >
                <Stack
                    sx={{
                        flexBasis: '350px',
                        flexShrink: '0',
                    }}
                >
                    <SearchField
                        noOptionsText={<NoOptionsText domain={domain} />}
                        placeholder={`Select or invite using @${store?.domain} email`}
                        id={`approver_${stepNumber}_${approverId}`}
                        options={approversOptionsWithNewInvitees}
                        getOptionLabel={renderLabel}
                        filterOptions={(options, state) => {
                            const val = state.inputValue;
                            return options.filter((item) => {
                                return item.email?.includes(val) || item.label.includes(val);
                            });
                        }}
                        {...inputProps}
                    />
                    {inputProps.hasError && (
                        <Typography
                            sx={{
                                ...theme.typography.caption,
                                color: theme.palette.red.primary,
                                marginTop: '5px',
                            }}
                        >
                            Approver is required
                        </Typography>
                    )}
                </Stack>
                {!isFirstApprover && (
                    <CrossButton
                        onClick={() => clearApprover(stepNumber, approverId)}
                        sx={{
                            flexGrow: '0',
                            flexShrink: 0,
                            marginLeft: '10px',
                            transform: inputProps.hasError ? 'translateY(-10px)' : '',
                        }}
                    />
                )}
            </Stack>
        </Stack>
    );
};

type StepBoxProps = {
    stepNumber: number;
    approvers: Tapprover[];
    approversList: IApprover[];
};

const StepBox = ({ approvers, stepNumber, approversList }: StepBoxProps) => {
    const { addApprover, clearStep } = useFormActions();
    const { steps } = useFormStore();

    const isOrDisabled = useMemo(() => {
        const currentStepAllApproversHasValidValue =
            steps[stepNumber].approvers.filter((item) => item.value && item.value.id).length ===
            steps[stepNumber].approvers.length;
        return !currentStepAllApproversHasValidValue;
    }, [steps, stepNumber]);

    const isOrInvisible = useMemo(() => {
        // In case of collaborators this logic is not required
        // const stepsRenderedSimilarToApprovers = steps[stepNumber].approvers.length === approversList.length;
        // const allApproversSelected = getAllSelectedApproverIds(steps).length === approversList.length;
        // return stepsRenderedSimilarToApprovers || allApproversSelected;
        return false;
    }, []);

    const approversWhoWillApprove = useMemo(() => {
        return approvers.map(({ id, value }, index) => {
            return (
                <React.Fragment key={id}>
                    <StepApprover
                        isFirstApprover={index === 0}
                        stepNumber={stepNumber}
                        approverId={id}
                        value={value}
                        approversList={approversList}
                    />
                    {index < approvers.length - 1 && (
                        <Box sx={{ marginBottom: '14px' }} color="gray.gray3">
                            <Typography
                                sx={{
                                    ...theme.typography.caption,
                                }}
                            >
                                OR
                            </Typography>
                        </Box>
                    )}
                </React.Fragment>
            );
        });
    }, [stepNumber, approversList, approvers]);

    return (
        <Box
            sx={{
                paddingLeft: '22px',
                position: 'relative',
                borderLeft: '1px #D3DAE7 solid',
                paddingBottom: '25px',
                maxWidth: '467px',
            }}
        >
            <Stack spacing={1}>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            ...theme.typography.body2_medium,
                        }}
                        color={theme.palette.gray.black}
                    >
                        Step {stepNumber + 1}
                    </Typography>
                    {stepNumber > 0 && (
                        <Button
                            onClick={() => clearStep(stepNumber)}
                            disableRipple
                            variant="text"
                            aria-describedby="approver_or_btn"
                            sx={{
                                ...theme.typography.h4,
                                color: theme.palette.blue.primary,
                                padding: '0',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            Remove Step
                        </Button>
                    )}
                </Stack>
                <Box
                    sx={{
                        backgroundColor: '#F2F6FF',
                        padding: '20px',
                    }}
                >
                    {approversWhoWillApprove}
                    {!isOrInvisible && (
                        <Button
                            sx={{
                                paddingLeft: 0,
                                justifyContent: 'flex-start',
                                ...theme.typography.h5,
                                color: theme.palette.blue.primary,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                            onClick={() => addApprover(stepNumber)}
                            disableRipple
                            variant="text"
                            disabled={isOrDisabled}
                        >
                            + OR
                        </Button>
                    )}
                </Box>
            </Stack>
            <Box
                sx={{
                    position: 'absolute',
                    left: '-13px',
                    top: '-1px',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                }}
            >
                <CheckSvg />
            </Box>
        </Box>
    );
};

const AddStep = () => {
    const { addStep } = useFormActions();
    const { steps } = useFormStore();
    const isFormValid = isApproversFormValid(steps);
    // not required in case of collaborators
    // const totalUsersSelected = getAllSelectedApproverIds(steps);
    // const isAllUsersSelected = totalUsersSelected.length === totalApproversCount;

    const isDisabled = !isFormValid;
    return (
        <Stack
            sx={{
                position: 'relative',
                paddingLeft: '22px',
                marginBottom: '14px',
            }}
            direction="row"
        >
            <Box
                sx={{
                    width: '25px',
                    height: '25px',
                    position: 'absolute',
                    left: '-12px',
                    top: '-1px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& svg>path': {
                        fill: isDisabled ? theme.palette.gray.gray5 : '',
                    },
                }}
            >
                <CheckSvg />
            </Box>
            <Button
                disabled={isDisabled}
                sx={{
                    padding: 0,
                    margin: 0,
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                }}
                onClick={() => addStep()}
                variant="text"
                aria-describedby="add_step_btn_txt"
            >
                <Typography
                    id="add_step_btn_txt"
                    sx={{
                        ...theme.typography.h4,
                        color: isDisabled ? theme.palette.gray.gray4 : theme.palette.blue.primary,
                        textTransform: 'capitalize',
                    }}
                >
                    Add Step
                </Typography>
            </Button>
        </Stack>
    );
};

type CreateApprovalProps = {
    navigationPrompt?: React.ReactElement;
    navigationPromtModal?: PromptModalType;
};

const CreateApproval = ({ navigationPrompt, navigationPromtModal }: CreateApprovalProps) => {
    const store = useGlobalStore();
    const { steps } = useFormStore();
    const { clearStore } = useFormActions();
    const [isPromtVisible, setPromtVisible] = useState(false);

    const { status: approversListStatus, data: approversList } = useGetSmApprovers(
        store?.browserParams.smid || '',
        store?.isMocked || false
    );

    const { status: approvalsListStatus, data: approvalListData } = useGetSmApprovalsList(
        store?.browserParams.smid || '',
        true,
        store?.isMocked || false
    );

    const { createApproval, isCreatingApproval, isSuccess } = useCreateApproval(store?.isMocked || false);
    const {
        inputProps: nameInputProps,
        hasError,
        errorMessage,
    } = useInputValidator({ validator: (value) => validateNameField(value, approvalListData || []) });

    useEffect(() => {
        return () => {
            clearStore();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createApproversData = () => {
        const data: StepBody[][] = [];
        const stepsValues = Object.values(steps);
        for (const step of stepsValues) {
            const result: StepBody[] = step.approvers.map((approver) => {
                const approverData = approversList?.find((user) => {
                    const stepApproverId = approver.value ? approver.value.id : '';
                    return user.id == stepApproverId;
                });
                let value: string = '';
                if (approver.value) {
                    value = approver.value.id.split('_')[0];
                }

                return {
                    type: approverData?.type || 'COLLABORATOR',
                    value: value || '',
                };
            });
            data.push(result);
        }
        return data;
    };

    const onCreateApproval = () => {
        const approvalCreateData = createApproversData();
        // to Make a Post request
        const formData = {
            name: nameInputProps.value.trim(),
            smId: store?.browserParams.smid || '',
            steps: approvalCreateData,
        };
        createApproval(formData);
    };

    const stepsList = useMemo(() => {
        return steps.map(({ stepNumber, approvers }) => {
            return (
                <StepBox
                    key={stepNumber}
                    stepNumber={stepNumber}
                    approvers={approvers}
                    approversList={approversList || []}
                />
            );
        });
    }, [steps, approversList]);

    const isFormValid = useMemo(() => {
        return !validateNameField(nameInputProps.value, approvalListData || []).hasError && isApproversFormValid(steps);
    }, [nameInputProps.value, steps, approvalListData]);

    const hasAnyDataInForm = useMemo(() => {
        const hasName = !!nameInputProps.value;
        let hasDataInAnyStep = false;
        const stepsValues = Object.values(steps);
        for (const step of stepsValues) {
            const hasData = step.approvers.find((approver) => approver.value && approver.value.id);
            if (hasData) {
                hasDataInAnyStep = true;
                break;
            }
        }
        return hasName || hasDataInAnyStep;
    }, [nameInputProps.value, steps]);

    const activateLeavePrompt = () => {
        if (hasAnyDataInForm && navigationPromtModal) {
            setPromtVisible(true);
            return true;
        }
        return false;
    };

    const navigateToListFlow = () => {
        const path = '/';
        store && store.navigateInParentWindow(path);
    };

    const onGoBack = () => {
        if (!activateLeavePrompt()) {
            navigateToListFlow();
        }
    };

    if (isSuccess) {
        navigateToListFlow();
        return null;
    }

    if (approversListStatus === 'error') {
        return <Typography variant="caption">Not able to get the approvers list ...</Typography>;
    }

    if (approvalsListStatus === 'error') {
        return <Typography variant="caption">Not able to get the approvals list ...</Typography>;
    }

    const PromtModal = navigationPromtModal;

    return (
        <Stack
            sx={{
                paddingBottom: '60px',
            }}
        >
            <Header onGoBack={onGoBack} />
            <Box>
                <InputArea
                    hasError={hasError}
                    errorMessage={errorMessage}
                    onChange={nameInputProps.onChange}
                    value={nameInputProps.value}
                />
                {stepsList}
                <AddStep />
                <Button
                    disableElevation
                    disabled={isCreatingApproval || !isFormValid}
                    onClick={onCreateApproval}
                    sx={{
                        backgroundColor: theme.palette.blue.primary,
                        fontSize: '13px',
                        width: '175px',
                        height: '32px',
                        '&.MuiButton-root.Mui-disabled': {
                            backgroundColor: isCreatingApproval ? theme.palette.blue.primary : theme.palette.gray.gray6,
                            color: theme.palette.gray.gray4,
                        },
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    }}
                    variant="contained"
                    fullWidth={false}
                >
                    {isCreatingApproval ? (
                        <CircularProgress sx={{ color: 'white' }} size={20} />
                    ) : (
                        <Typography
                            sx={{
                                ...theme.typography.buttonMedium,
                                textTransform: 'capitalize',
                            }}
                            noWrap
                        >
                            Create Approval Flow
                        </Typography>
                    )}
                </Button>
            </Box>
            {hasAnyDataInForm && navigationPrompt}
            {!!PromtModal && (
                <PromtModal
                    shown={isPromtVisible}
                    onStay={() => setPromtVisible(false)}
                    onLeave={navigateToListFlow}
                    description="Your setup is incomplete. Complete your setup to save approval flow or discard the changes you’ve made."
                />
            )}
        </Stack>
    );
};

export const CreateApprovalPage = ({ navigationPrompt, navigationPromtModal }: CreateApprovalProps) => {
    return (
        <FormProvider>
            <CreateApproval navigationPrompt={navigationPrompt} navigationPromtModal={navigationPromtModal} />
        </FormProvider>
    );
};
