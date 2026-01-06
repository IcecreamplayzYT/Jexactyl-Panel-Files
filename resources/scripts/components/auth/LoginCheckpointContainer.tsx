import tw from 'twin.macro';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import { ActionCreator } from 'easy-peasy';
import { StaticContext } from 'react-router';
import { FlashStore } from '@/state/flashes';
import Field from '@/components/elements/Field';
import { useFormikContext, withFormik } from 'formik';
import loginCheckpoint from '@/api/auth/loginCheckpoint';
import { Button } from '@/components/elements/button/index';
import { Link, RouteComponentProps } from 'react-router-dom';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';

interface Values {
    code: string;
    recoveryCode: '';
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>;

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
};

const LoginCheckpointContainer = () => {
    const { isSubmitting, setFieldValue } = useFormikContext<Values>();
    const [isMissingDevice, setIsMissingDevice] = useState(false);
    
    // Easy to swap between env and state
    const siteName = process.env.REACT_APP_SITE_NAME || 'NeoDesigns Hosting';
    // const siteName = useStoreState((state) => state.settings.data?.name) || 'NeoDesigns Hosting';

    return (
        <LoginFormContainer 
            title={siteName} 
            subtitle="Two-Factor Authentication"
        >
            <div css={tw`mb-6`}>
                <p css={tw`text-sm text-gray-400 text-center`}>
                    {isMissingDevice
                        ? 'Enter one of your recovery codes to continue.'
                        : 'Enter the authentication code from your device.'}
                </p>
            </div>

            <div css={tw`mb-6`}>
                <Field
                    light
                    name={isMissingDevice ? 'recoveryCode' : 'code'}
                    label={isMissingDevice ? 'Recovery Code' : 'Authentication Code'}
                    type={'text'}
                    autoComplete={'one-time-code'}
                    autoFocus
                    placeholder={isMissingDevice ? 'Enter recovery code' : 'Enter 6-digit code'}
                />
            </div>

            <div css={tw`mt-6`}>
                <Button
                    size={Button.Sizes.Large}
                    css={[
                        tw`w-full font-medium py-3 rounded-lg transition-colors text-white`,
                        isSubmitting ? tw`bg-blue-500 opacity-75 cursor-not-allowed` : tw`bg-blue-500 hover:bg-blue-600`,
                    ]}
                    type={'submit'}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Verifying...' : 'Continue'}
                </Button>
            </div>

            <div css={tw`mt-6 text-center`}>
                <button
                    type="button"
                    onClick={() => {
                        setFieldValue('code', '');
                        setFieldValue('recoveryCode', '');
                        setIsMissingDevice((s) => !s);
                    }}
                    css={tw`text-sm text-gray-400 hover:text-blue-400 transition-colors cursor-pointer`}
                >
                    {!isMissingDevice ? "I've Lost My Device" : 'I Have My Device'}
                </button>
            </div>

            <div css={tw`mt-4 text-center`}>
                <Link
                    to={'/auth/login'}
                    css={tw`text-sm text-blue-400 hover:text-blue-300 transition-colors`}
                >
                    Return to Login
                </Link>
            </div>
        </LoginFormContainer>
    );
};

const EnhancedForm = withFormik<Props, Values>({
    handleSubmit: ({ code, recoveryCode }, { setSubmitting, props: { clearAndAddHttpError, location } }) => {
        loginCheckpoint(location.state?.token || '', code, recoveryCode)
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }
                setSubmitting(false);
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    },

    mapPropsToValues: () => ({
        code: '',
        recoveryCode: '',
    }),
})(LoginCheckpointContainer);

export default ({ history, location, ...props }: OwnProps) => {
    const { clearAndAddHttpError } = useFlash();

    // Try to get token from location state first, fall back to sessionStorage (set by LoginContainer)
    let token: string | undefined = undefined;
    if (location && (location as any).state && (location as any).state.token) {
        token = (location as any).state.token;
    } else if (typeof window !== 'undefined') {
        token = sessionStorage.getItem('checkpointToken') || undefined;
    }

    if (!token) {
        history.replace('/auth/login');
        return null;
    }

    // Ensure location passed to the form contains the token in state so withFormik handler can access it.
    const locationWithState = (location && (location as any).state && (location as any).state.token)
        ? location
        : { ...location, state: { ...(location as any).state, token } };

    // Clear stored token now that it's consumed
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.removeItem('checkpointToken');
        } catch (e) {
            // ignore
        }
    }

    return (
        <EnhancedForm
            clearAndAddHttpError={clearAndAddHttpError}
            history={history}
            location={locationWithState as any}
            {...props}
        />
    );
};