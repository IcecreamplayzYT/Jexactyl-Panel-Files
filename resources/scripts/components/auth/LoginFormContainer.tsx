// // import tw from 'twin.macro';
// // import { Form } from 'formik';
// // import { breakpoint } from '@/theme';
// // import React, { forwardRef } from 'react';
// // import styled from 'styled-components/macro';
// // import FlashMessageRender from '@/components/FlashMessageRender';

// // type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
// //     title?: string;
// //     subtitle?: string;
// // };

// // const Container = styled.div`
// //     ${breakpoint('sm')`
// //         ${tw`w-4/5 mx-auto`}
// //     `};

// //     ${breakpoint('md')`
// //         ${tw`p-10`}
// //     `};

// //     ${breakpoint('lg')`
// //         ${tw`w-3/5`}
// //     `};

// //     ${breakpoint('xl')`
// //         ${tw`w-full`}
// //         max-width: 500px;
// //     `};
// // `;

// // const FormWrapper = styled.div`
// //     ${tw`w-full bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-700`}
// // `;

// // export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
// //     <div css={tw`min-h-screen flex items-center justify-center p-4`} style={{ backgroundColor: '#1a1a1a' }}>
// //         <Container>
// //             <FlashMessageRender css={tw`mb-4 px-1`} />
// //             <FormWrapper>
// //                 {title && (
// //                     <div css={tw`text-center mb-6`}>
// //                         <h2 css={tw`text-3xl text-white font-bold mb-2`}>{title}</h2>
// //                         {subtitle && (
// //                             <p css={tw`text-gray-400 text-sm`}>{subtitle}</p>
// //                         )}
// //                     </div>
// //                 )}
// //                 <Form {...props} ref={ref}>
// //                     {props.children}
// //                 </Form>
// //             </FormWrapper>
// //         </Container>
// //     </div>
// // ));

// import tw from 'twin.macro';
// import { Form } from 'formik';
// import { breakpoint } from '@/theme';
// import React, { forwardRef } from 'react';
// import styled from 'styled-components/macro';
// import FlashMessageRender from '@/components/FlashMessageRender';

// type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
//     title?: string;
//     subtitle?: string;
// };

// const Container = styled.div`
//     ${breakpoint('sm')`
//         ${tw`w-4/5 mx-auto`}
//     `};

//     ${breakpoint('md')`
//         ${tw`p-10`}
//     `};

//     ${breakpoint('lg')`
//         ${tw`w-3/5`}
//     `};

//     ${breakpoint('xl')`
//         ${tw`w-full`}
//         max-width: 500px;
//     `};
// `;

// const FormWrapper = styled.div`
//     ${tw`w-full bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-700`}
// `;

// export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
//     <div css={tw`min-h-screen flex items-center justify-center p-4`} style={{ backgroundColor: '#1a1a1a', margin: 0, overflow: 'hidden' }}>
//         <Container css={tw`my-auto`}>
//             <FlashMessageRender css={tw`mb-4 px-1`} />
//             <FormWrapper>
//                 {title && (
//                     <div css={tw`text-center mb-6`}>
//                         <h2 css={tw`text-3xl text-white font-bold mb-2`}>{title}</h2>
//                         {subtitle && (
//                             <p css={tw`text-gray-400 text-sm`}>{subtitle}</p>
//                         )}
//                     </div>
//                 )}
//                 <Form {...props} ref={ref}>
//                     {props.children}
//                 </Form>
//             </FormWrapper>
//         </Container>
//     </div>
// ));

import tw from 'twin.macro';
import { Form } from 'formik';
import { breakpoint } from '@/theme';
import React, { forwardRef } from 'react';
import styled from 'styled-components/macro';
import FlashMessageRender from '@/components/FlashMessageRender';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
};

const Container = styled.div`
    ${tw`bg-gray-800 rounded-2xl shadow-xl p-8`};
    width: 100%;
    max-width: 28rem;

    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full max-w-xl`}
    `};
`;

const Wrapper = styled.div`
    ${tw`flex flex-col`};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <div css={tw`min-h-screen flex items-center justify-center p-4`} style={{ backgroundColor: '#1a1a1a' }}>
        <Container>
            <Wrapper>
                {title && (
                    <div css={tw`text-center mb-8`}>
                        <h1 css={tw`text-3xl font-bold text-white mb-2`}>
                            {title}
                        </h1>
                        {subtitle && (
                            <p css={tw`text-sm text-gray-400`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                
                <FlashMessageRender css={tw`mb-4 px-1`} />
                <Form {...props} ref={ref}>
                    {props.children}
                </Form>
            </Wrapper>
        </Container>
    </div>
));