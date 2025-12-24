// // import tw from 'twin.macro';
// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { object, ref, string } from 'yup';
// // import { ApplicationStore } from '@/state';
// // import { httpErrorToHuman } from '@/api/http';
// // import { Formik, FormikHelpers } from 'formik';
// // import Field from '@/components/elements/Field';
// // import Input from '@/components/elements/Input';
// // import { RouteComponentProps } from 'react-router';
// // import { Actions, useStoreActions } from 'easy-peasy';
// // import { Button } from '@/components/elements/button/index';
// // import performPasswordReset from '@/api/auth/performPasswordReset';
// // import LoginFormContainer from '@/components/auth/LoginFormContainer';

// // interface Values {
// //     password: string;
// //     passwordConfirmation: string;
// // }

// // export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
// //     const [email, setEmail] = useState('');

// //     const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

// //     const parsed = new URLSearchParams(location.search);
// //     if (email.length === 0 && parsed.get('email')) {
// //         setEmail(parsed.get('email') || '');
// //     }

// //     const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
// //         clearFlashes();
// //         performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
// //             .then(() => {
// //                 // @ts-expect-error this is valid
// //                 window.location = '/';
// //             })
// //             .catch((error) => {
// //                 console.error(error);

// //                 setSubmitting(false);
// //                 addFlash({ type: 'danger', title: 'Error', message: httpErrorToHuman(error) });
// //             });
// //     };

// //     return (
// //         <Formik
// //             onSubmit={submit}
// //             initialValues={{
// //                 password: '',
// //                 passwordConfirmation: '',
// //             }}
// //             validationSchema={object().shape({
// //                 password: string()
// //                     .required('A new password is required.')
// //                     .min(8, 'Your new password should be at least 8 characters in length.'),
// //                 passwordConfirmation: string()
// //                     .required('Your new password does not match.')
// //                     // @ts-expect-error this is valid
// //                     .oneOf([ref('password'), null], 'Your new password does not match.'),
// //             })}
// //         >
// //             {({ isSubmitting }) => (
// //                 <LoginFormContainer title={'Reset Password'} css={tw`w-full flex`}>
// //                     <div>
// //                         <label>Email</label>
// //                         <Input value={email} isLight disabled />
// //                     </div>
// //                     <div css={tw`mt-6`}>
// //                         <Field
// //                             light
// //                             label={'New Password'}
// //                             name={'password'}
// //                             type={'password'}
// //                             description={'Passwords must be at least 8 characters in length.'}
// //                         />
// //                     </div>
// //                     <div css={tw`mt-6`}>
// //                         <Field light label={'Confirm New Password'} name={'passwordConfirmation'} type={'password'} />
// //                     </div>
// //                     <div css={tw`mt-6`}>
// //                         <Button size={Button.Sizes.Large} css={tw`w-full`} type={'submit'} disabled={isSubmitting}>
// //                             Reset Password
// //                         </Button>
// //                     </div>
// //                     <div css={tw`mt-6 text-center`}>
// //                         <Link
// //                             to={'/auth/login'}
// //                             css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
// //                         >
// //                             Return to Login
// //                         </Link>
// //                     </div>
// //                 </LoginFormContainer>
// //             )}
// //         </Formik>
// //     );
// // };

// import tw from 'twin.macro';
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { object, ref, string } from 'yup';
// import { ApplicationStore } from '@/state';
// import { httpErrorToHuman } from '@/api/http';
// import { Formik, FormikHelpers } from 'formik';
// import Field from '@/components/elements/Field';
// import Input from '@/components/elements/Input';
// import { RouteComponentProps } from 'react-router';
// import { Actions, useStoreActions } from 'easy-peasy';
// import { Button } from '@/components/elements/button/index';
// import performPasswordReset from '@/api/auth/performPasswordReset';
// import LoginFormContainer from '@/components/auth/LoginFormContainer';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import { useStoreState } from 'easy-peasy';
// import discordLogin from '@/api/auth/discord';
// import useFlash from '@/plugins/useFlash';

// interface Values {
//     password: string;
//     passwordConfirmation: string;
// }

// export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
//     const [email, setEmail] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [discordLoading, setDiscordLoading] = useState(false);

//     const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
//     const { clearAndAddHttpError } = useFlash();
//     const name = useStoreState((state) => state.settings.data?.name);
//     const discord = useStoreState((state) => state.settings.data?.registration.discord);

//     const parsed = new URLSearchParams(location.search);
//     if (email.length === 0 && parsed.get('email')) {
//         setEmail(parsed.get('email') || '');
//     }

//     const handleDiscordLogin = () => {
//         clearFlashes();
//         setDiscordLoading(true);

//         discordLogin()
//             .then((data) => {
//                 if (!data) {
//                     clearAndAddHttpError({ error: 'Discord auth failed. Please try again.' });
//                     setDiscordLoading(false);
//                     return;
//                 }
//                 window.location.href = data;
//             })
//             .catch((error) => {
//                 console.error(error);
//                 setDiscordLoading(false);
//                 clearAndAddHttpError({ error });
//             });
//     };

//     const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
//         clearFlashes();
//         performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
//             .then(() => {
//                 // @ts-expect-error this is valid
//                 window.location = '/';
//             })
//             .catch((error) => {
//                 console.error(error);
//                 setSubmitting(false);
//                 addFlash({ type: 'danger', title: 'Error', message: httpErrorToHuman(error) });
//             });
//     };

//     return (
//         <Formik
//             onSubmit={submit}
//             initialValues={{
//                 password: '',
//                 passwordConfirmation: '',
//             }}
//             validationSchema={object().shape({
//                 password: string()
//                     .required('A new password is required.')
//                     .min(8, 'Your new password should be at least 8 characters in length.'),
//                 passwordConfirmation: string()
//                     .required('Your new password does not match.')
//                     // @ts-expect-error this is valid
//                     .oneOf([ref('password'), null], 'Your new password does not match.'),
//             })}
//         >
//             {({ isSubmitting }) => (
//                 <LoginFormContainer 
//                     title={name || 'NeoDesigns Hosting'} 
//                     subtitle="Reset your password"
//                 >
//                     <div css={tw`mb-6`}>
//                         <label css={tw`block text-sm font-medium text-gray-300 mb-2`}>Email</label>
//                         <Input 
//                             value={email} 
//                             isLight 
//                             disabled 
//                             css={tw`w-full bg-gray-700 border-gray-600 text-gray-400`}
//                         />
//                     </div>

//                     <div css={tw`space-y-4`}>
//                         <div css={tw`relative`}>
//                             <Field
//                                 light
//                                 label={'New Password'}
//                                 name={'password'}
//                                 type={showPassword ? 'text' : 'password'}
//                                 description={'Passwords must be at least 8 characters in length.'}
//                                 placeholder="Enter your new password"
//                             />
//                             <div css={tw`absolute right-3 top-9 flex items-center space-x-2`}>
//                                 <FontAwesomeIcon icon={faEye} css={tw`text-yellow-400 text-sm`} />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     css={tw`text-gray-400 hover:text-gray-300 focus:outline-none`}
//                                 >
//                                     <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} css={tw`text-sm`} />
//                                 </button>
//                             </div>
//                         </div>

//                         <div css={tw`relative`}>
//                             <Field 
//                                 light 
//                                 label={'Confirm New Password'} 
//                                 name={'passwordConfirmation'} 
//                                 type={showConfirmPassword ? 'text' : 'password'}
//                                 placeholder="Confirm your new password"
//                             />
//                             <div css={tw`absolute right-3 top-9 flex items-center space-x-2`}>
//                                 <FontAwesomeIcon icon={faEye} css={tw`text-yellow-400 text-sm`} />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     css={tw`text-gray-400 hover:text-gray-300 focus:outline-none`}
//                                 >
//                                     <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} css={tw`text-sm`} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div css={tw`mt-6`}>
//                         <Button 
//                             size={Button.Sizes.Large} 
//                             css={tw`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors`} 
//                             type={'submit'} 
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? 'Resetting...' : 'Reset Password'}
//                         </Button>
//                     </div>

//                     {discord && (
//                         <>
//                             <div css={tw`relative my-6`}>
//                                 <div css={tw`absolute inset-0 flex items-center`}>
//                                     <div css={tw`w-full border-t border-gray-600`}></div>
//                                 </div>
//                                 <div css={tw`relative flex justify-center text-sm`}>
//                                     <span css={tw`px-4 bg-gray-800 text-gray-400 uppercase tracking-wide text-xs`}>
//                                         OR CONTINUE WITH
//                                     </span>
//                                 </div>
//                             </div>

//                             <div css={tw`grid grid-cols-2 gap-4`}>
//                                 <button
//                                     type="button"
//                                     onClick={handleDiscordLogin}
//                                     disabled={discordLoading}
//                                     css={tw`flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700`}
//                                 >
//                                     <img 
//                                         src="/assets/svgs/discord.svg" 
//                                         alt="Discord" 
//                                         css={tw`w-5 h-5 mr-2`}
//                                     />
//                                     <span css={tw`font-medium text-sm`}>Discord</span>
//                                 </button>
                                
//                                 <button
//                                     type="button"
//                                     disabled={true}
//                                     css={tw`flex items-center justify-center px-4 py-3 bg-gray-900 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed opacity-60`}
//                                 >
//                                     <svg css={tw`w-5 h-5 mr-2`} viewBox="0 0 24 24">
//                                         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                                         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                                         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                                         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                                     </svg>
//                                     <span css={tw`font-medium text-sm`}>Google</span>
//                                     <span css={tw`ml-1 text-xs`}>(Coming Soon)</span>
//                                 </button>
//                             </div>
//                         </>
//                     )}

//                     <div css={tw`mt-6 text-center`}>
//                         <Link
//                             to={'/auth/login'}
//                             css={tw`text-sm text-blue-400 hover:text-blue-300 transition-colors`}
//                         >
//                             Return to Login
//                         </Link>
//                     </div>
//                 </LoginFormContainer>
//             )}
//         </Formik>
//     );
// };

import tw from 'twin.macro';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { object, ref, string } from 'yup';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import { RouteComponentProps } from 'react-router';
import { Actions, useStoreActions } from 'easy-peasy';
import { Button } from '@/components/elements/button/index';
import performPasswordReset from '@/api/auth/performPasswordReset';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import discordLogin from '@/api/auth/discord';
import useFlash from '@/plugins/useFlash';

interface Values {
    password: string;
    passwordConfirmation: string;
}

export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [discordLoading, setDiscordLoading] = useState(false);

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
    const { clearAndAddHttpError } = useFlash();
    
    // Easy to swap between env and state
    const siteName = process.env.REACT_APP_SITE_NAME || 'NeoDesigns Hosting';
    // const siteName = useStoreState((state) => state.settings.data?.name) || 'NeoDesigns Hosting';
    
    const discord = useStoreState((state) => state.settings.data?.registration.discord);

    const parsed = new URLSearchParams(location.search);
    if (email.length === 0 && parsed.get('email')) {
        setEmail(parsed.get('email') || '');
    }

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

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                addFlash({ type: 'danger', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                password: string()
                    .required('A new password is required.')
                    .min(8, 'Your new password should be at least 8 characters in length.'),
                passwordConfirmation: string()
                    .required('Your new password does not match.')
                    // @ts-expect-error this is valid
                    .oneOf([ref('password'), null], 'Your new password does not match.'),
            })}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer 
                    title={siteName} 
                    subtitle="Reset your password"
                >
                    <div css={tw`mb-6`}>
                        <label css={tw`block text-sm font-medium text-gray-300 mb-2`}>Email</label>
                        <Input 
                            value={email} 
                            isLight 
                            disabled 
                            css={tw`w-full bg-gray-700 border-gray-600 text-gray-400`}
                        />
                    </div>

                    <div css={tw`space-y-4`}>
                        <div css={tw`relative`}>
                            <Field
                                light
                                label={'New Password'}
                                name={'password'}
                                type={showPassword ? 'text' : 'password'}
                                description={'Passwords must be at least 8 characters in length.'}
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                css={tw`absolute right-3 top-9 text-gray-400 hover:text-gray-300 focus:outline-none`}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} css={tw`text-sm`} />
                            </button>
                        </div>

                        <div css={tw`relative`}>
                            <Field 
                                light 
                                label={'Confirm New Password'} 
                                name={'passwordConfirmation'} 
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                css={tw`absolute right-3 top-9 text-gray-400 hover:text-gray-300 focus:outline-none`}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} css={tw`text-sm`} />
                            </button>
                        </div>
                    </div>

                    <div css={tw`mt-6`}>
                        <Button 
                            size={Button.Sizes.Large} 
                            css={tw`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors`} 
                            type={'submit'} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>

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
                                    disabled={true}
                                    title="Coming Soon"
                                    css={tw`flex items-center justify-center px-4 py-3 bg-gray-900 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed opacity-60`}
                                >
                                    <svg css={tw`w-5 h-5 mr-2`} viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span css={tw`font-medium text-sm`}>Google</span>
                                </button>
                            </div>
                        </>
                    )}

                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-sm text-blue-400 hover:text-blue-300 transition-colors`}
                        >
                            Return to Login
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};