import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import { object, string } from 'yup';
import useFlash from '@/plugins/useFlash';
import register from '@/api/auth/register';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import { Link, RouteComponentProps } from 'react-router-dom';
import FlashMessageRender from '@/components/FlashMessageRender';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import discordLogin from '@/api/auth/discord';

interface Values {
    username: string;
    email: string;
    password: string;
}

const RegisterContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [discordLoading, setDiscordLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Easy to swap between env and state
    const siteName = process.env.REACT_APP_SITE_NAME || 'NeoDesigns Hosting';
    // const siteName = useStoreState((state) => state.settings.data?.name) || 'NeoDesigns Hosting';
    
    const discord = useStoreState((state) => state.settings.data?.registration.discord);
    const { clearFlashes, clearAndAddHttpError, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleGoogleLogin = () => {
        clearFlashes();
        setGoogleLoading(true);
        
        // Simple redirect to your backend route
        // Your backend will handle the OAuth redirect
        window.location.href = '/auth/google';
    };

    const handleDiscordLogin = () => {
        clearFlashes();
        setDiscordLoading(true);

        discordLogin()
            .then((data) => {
                if (!data) {
                    clearAndAddHttpError({ error: 'Discord auth failed. Please try again.' });
                    setDiscordLoading(false);
                    return;
                }
                window.location.href = data;
            })
            .catch((error) => {
                console.error(error);
                setDiscordLoading(false);
                clearAndAddHttpError({ error });
            });
    };

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        register({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    history.replace('/auth/login');
                    addFlash({
                        key: 'auth:register',
                        type: 'success',
                        message: 'Account has been successfully created.',
                    });
                    return;
                }
                history.replace('/auth/register');
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={object().shape({
                username: string().min(3, 'Username must be at least 3 characters').required('Username is required'),
                email: string().email('Please enter a valid email address').required('Email is required'),
                password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={siteName} subtitle="Create your account to get started">
                    <FlashMessageRender byKey={'auth:register'} css={tw`mb-4`} />
                    
                    <div css={tw`space-y-4`}>
                        <Field 
                            type={'text'} 
                            label={'Username'} 
                            name={'username'} 
                            disabled={isSubmitting}
                            placeholder="Choose a username"
                        />

                        <Field
                            type={'email'}
                            label={'Email Address'}
                            name={'email'}
                            disabled={isSubmitting}
                            placeholder="Enter your email"
                        />

                        <div css={tw`relative`}>
                            <Field
                                type={showPassword ? 'text' : 'password'}
                                label={'Password'}
                                name={'password'}
                                disabled={isSubmitting}
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                css={tw`absolute right-3 top-9 text-gray-400 hover:text-gray-300 focus:outline-none`}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} css={tw`text-sm`} />
                            </button>
                        </div>
                    </div>

                    <div css={tw`mt-6`}>
                        <Button 
                            type={'submit'} 
                            css={tw`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors`} 
                            size={Button.Sizes.Large} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Register'}
                        </Button>
                    </div>

                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}

                    {discord && (
                        <>
                            <div css={tw`relative my-6`}>
                                <div css={tw`absolute inset-0 flex items-center`}>
                                    <div css={tw`w-full border-t border-gray-600`}></div>
                                </div>
                                <div css={tw`relative flex justify-center text-sm`}>
                                    <span css={tw`px-4 bg-gray-800 text-gray-400 uppercase tracking-wide text-xs`}>
                                        OR CONTINUE WITH
                                    </span>
                                </div>
                            </div>

                            <div css={tw`grid grid-cols-2 gap-4`}>
                                <button
                                    type="button"
                                    onClick={handleDiscordLogin}
                                    disabled={discordLoading}
                                    css={tw`flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700`}
                                >
                                    <img 
                                        src="/assets/svgs/discord.svg" 
                                        alt="Discord" 
                                        css={tw`w-5 h-5 mr-2`}
                                    />
                                    <span css={tw`font-medium text-sm`}>Discord</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading}
                                    css={tw`flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <svg css={tw`w-5 h-5 mr-2`} viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span css={tw`font-medium text-sm`}>
                                        {googleLoading ? 'Loading...' : 'Google'}
                                    </span>
                                </button>
                            </div>
                        </>
                    )}

                    <div css={tw`mt-6 text-center`}>
                        <span css={tw`text-sm text-gray-400`}>Already have an account? </span>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors`}
                        >
                            Sign In
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default RegisterContainer;