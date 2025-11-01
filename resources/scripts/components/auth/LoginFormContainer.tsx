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
    background-image: url('/path/to/your/background-image.jpg');
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
            </p>
        </Wrapper>
    </Container>
));