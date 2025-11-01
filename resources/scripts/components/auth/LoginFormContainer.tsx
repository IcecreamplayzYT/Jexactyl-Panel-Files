// import tw from 'twin.macro';
// import { Form } from 'formik';
// import { breakpoint } from '@/theme';
// import React, { forwardRef } from 'react';
// import styled from 'styled-components/macro';
// import FlashMessageRender from '@/components/FlashMessageRender';

// type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
//     title?: string;
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
//         max-width: 700px;
//     `};
// `;

// export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
//     <Container>
//         {title && <h2 css={tw`text-3xl text-center text-neutral-100 font-medium py-4`}>{title}</h2>}
//         <FlashMessageRender css={tw`mb-2 px-1`} />
//         <Form {...props} ref={ref}>
//             <div css={tw`md:flex w-full bg-black bg-opacity-25 shadow-lg rounded-lg p-6 mx-1`}>
//                 <div css={tw`flex-1`}>{props.children}</div>
//             </div>
//         </Form>
//         <p css={tw`text-neutral-500 text-xs mt-6 sm:float-left`}>
//             &copy; <a href={'https://jexactyl.com'}>Jexactyl,</a> built on{' '}
//             <a href={'https://pterodactyl.io'}>Pterodactyl.</a>
//         </p>
//         <p css={tw`text-neutral-500 text-xs mt-6 sm:float-right`}>
//             <a href={'https://jexactyl.com'}> Site </a>
//             &bull;
//             <a href={'https://github.com/jexactyl/jexactyl'}> GitHub </a>
//         </p>
//     </Container>
// ));

import tw from 'twin.macro';
import { Form } from 'formik';
import { breakpoint } from '@/theme';
import React, { forwardRef } from 'react';
import styled from 'styled-components/macro';
import FlashMessageRender from '@/components/FlashMessageRender';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${tw`min-h-screen flex items-center justify-center`}
    background-image: url('/var/www/jexactyl/public/alex-york-XmThzq_LeK0-unsplash.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    &::before {
        content: '';
        ${tw`absolute inset-0`}
        background: rgba(0, 0, 0, 0.3);
    }
`;

const Wrapper = styled.div`
    ${tw`relative z-10 w-full px-4`}
    
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        max-width: 450px;
    `};
`;

const FormBox = styled.div`
    ${tw`bg-gray-800 bg-opacity-90 rounded-lg p-8 shadow-2xl`}
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        <Wrapper>
            {title && (
                <h1 css={tw`text-4xl text-center text-white font-medium mb-8`}>
                    {title}
                </h1>
            )}
            <FormBox>
                <FlashMessageRender css={tw`mb-4`} />
                <Form {...props} ref={ref}>
                    {props.children}
                </Form>
            </FormBox>
            <p css={tw`text-center text-gray-400 text-sm mt-6`}>
                &copy; <a href={'https://discord.gg/neodesigns'}>NeoDesigns,</a> built on{'Jexactyl'}
                Photo by <a href="https://unsplash.com/@ayorkdesigns?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alex York</a> on <a href="https://unsplash.com/photos/a-foggy-forest-filled-with-lots-of-trees-XmThzq_LeK0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
            </p>
        </Wrapper>
    </Container>
));