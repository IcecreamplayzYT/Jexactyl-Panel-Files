// import tw from 'twin.macro';
// import Reaptcha from 'reaptcha';
// import login from '@/api/auth/login';
// import { object, string } from 'yup';
// import useFlash from '@/plugins/useFlash';
// import { useStoreState } from 'easy-peasy';
// import { Formik, FormikHelpers } from 'formik';
// import Field from '@/components/elements/Field';
// import React, { useEffect, useRef, useState } from 'react';
// import { Button } from '@/components/elements/button/index';
// import { Link, RouteComponentProps } from 'react-router-dom';
// import LoginFormContainer from '@/components/auth/LoginFormContainer';

// interface Values {
//     username: string;
//     password: string;
// }

// const LoginContainer = ({ history }: RouteComponentProps) => {
//     const ref = useRef<Reaptcha>(null);
//     const [token, setToken] = useState('');
//     const name = useStoreState((state) => state.settings.data?.name);
//     const email = useStoreState((state) => state.settings.data?.registration.email);
//     const discord = useStoreState((state) => state.settings.data?.registration.discord);

//     const { clearFlashes, clearAndAddHttpError } = useFlash();
//     const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

//     useEffect(() => {
//         clearFlashes();
//     }, []);

//     const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
//         clearFlashes();

//         // If there is no token in the state yet, request the token and then abort this submit request
//         // since it will be re-submitted when the recaptcha data is returned by the component.
//         if (recaptchaEnabled && !token) {
//             ref.current!.execute().catch((error) => {
//                 console.error(error);

//                 setSubmitting(false);
//                 clearAndAddHttpError({ error });
//             });

//             return;
//         }

//         login({ ...values, recaptchaData: token })
//             .then((response) => {
//                 if (response.complete) {
//                     // @ts-expect-error this is valid
//                     window.location = response.intended || '/';
//                     return;
//                 }

//                 history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
//             })
//             .catch((error) => {
//                 console.error(error);

//                 setToken('');
//                 if (ref.current) ref.current.reset();

//                 setSubmitting(false);
//                 clearAndAddHttpError({ error });
//             });
//     };

//     return (
//         <Formik
//             onSubmit={onSubmit}
//             initialValues={{ username: '', password: '' }}
//             validationSchema={object().shape({
//                 username: string().required('A username or email must be provided.'),
//                 password: string().required('Please enter your account password.'),
//             })}
//         >
//             {({ isSubmitting, setSubmitting, submitForm }) => (
//                 <LoginFormContainer title={'Login to ' + name} css={tw`w-full flex`}>
//                     <Field light type={'text'} label={'Username or Email'} name={'username'} disabled={isSubmitting} />
//                     <div css={tw`mt-6`}>
//                         <Field light type={'password'} label={'Password'} name={'password'} disabled={isSubmitting} />
//                     </div>
//                     <div css={tw`mt-6`}>
//                         <Button type={'submit'} size={Button.Sizes.Large} css={tw`w-full`} disabled={isSubmitting}>
//                             Login
//                         </Button>
//                     </div>
//                     {recaptchaEnabled && (
//                         <Reaptcha
//                             ref={ref}
//                             size={'invisible'}
//                             sitekey={siteKey || '_invalid_key'}
//                             onVerify={(response) => {
//                                 setToken(response);
//                                 submitForm();
//                             }}
//                             onExpire={() => {
//                                 setSubmitting(false);
//                                 setToken('');
//                             }}
//                         />
//                     )}
//                     <div css={tw`mt-6 text-center`}>
//                         <Link
//                             to={'/auth/password'}
//                             css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
//                         >
//                             Forgot password?
//                         </Link>
//                     </div>
//                     {(email || discord) && (
//                         <div css={tw`mt-6 text-center`}>
//                             {email && (
//                                 <Link
//                                     to={'/auth/register'}
//                                     css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
//                                 >
//                                     Signup with Email
//                                 </Link>
//                             )}
//                             {discord && (
//                                 <Link
//                                     to={'/auth/discord'}
//                                     css={tw`text-xs ml-6 text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
//                                 >
//                                     Authenticate with Discord
//                                 </Link>
//                             )}
//                         </div>
//                     )}
//                 </LoginFormContainer>
//             )}
//         </Formik>
//     );
// };

// export default LoginContainer;


import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import login from '@/api/auth/login';
import { object, string } from 'yup';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import { Link, RouteComponentProps } from 'react-router-dom';
import LoginFormContainer from '@/components/auth/LoginFormContainer';

const DarkInput = styled(Input)`
    ${tw`bg-gray-900 border-0 text-white placeholder-gray-500`}
    padding-left: 2.5rem;
    
    &:focus {
        ${tw`ring-2 ring-gray-700`}
    }
`;

const InputWrapper = styled.div`
    ${tw`relative`}
    
    svg {
        ${tw`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500`}
        width: 1.25rem;
        height: 1.25rem;
    }
`;

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const name = useStoreState((state) => state.settings.data?.name);
    const email = useStoreState((state) => state.settings.data?.registration.email);
    const discord = useStoreState((state) => state.settings.data?.registration.discord);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
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
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={'Welcome to ' + name} css={tw`w-full flex flex-col`}>
                    <div css={tw`mb-4`}>
                        <label css={tw`block text-gray-300 text-sm mb-2`}>Username or Email</label>
                        <div css={tw`relative`}>
                            <span css={tw`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500`}>
                                @
                            </span>
                            <Field 
                                light 
                                type={'text'} 
                                name={'username'} 
                                disabled={isSubmitting}
                                css={tw`w-full bg-gray-900 border-0 text-white pl-10 py-3 rounded`}
                            />
                        </div>
                    </div>
                    
                    <div css={tw`mb-6`}>
                        <div css={tw`flex justify-between items-center mb-2`}>
                            <label css={tw`text-gray-300 text-sm`}>Password</label>
                            <Link
                                to={'/auth/password'}
                                css={tw`text-xs text-green-500 hover:text-green-400`}
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div css={tw`relative`}>
                            <span css={tw`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500`}>
                                🔒
                            </span>
                            <Field 
                                light 
                                type={'password'} 
                                name={'password'} 
                                disabled={isSubmitting}
                                css={tw`w-full bg-gray-900 border-0 text-white pl-10 py-3 rounded`}
                            />
                        </div>
                    </div>
                    
                    <Button 
                        type={'submit'} 
                        size={Button.Sizes.Large} 
                        css={tw`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-medium`}
                        disabled={isSubmitting}
                    >
                        Login
                    </Button>
                    
                    {/* Rest of your code */}
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
