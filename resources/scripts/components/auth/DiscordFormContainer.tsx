// import React from 'react';
// import tw from 'twin.macro';
// import { breakpoint } from '@/theme';
// import styled from 'styled-components/macro';
// import { useStoreState } from '@/state/hooks';
// import FlashMessageRender from '@/components/FlashMessageRender';

// const Wrapper = styled.div`
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

// const DiscordFormContainer = ({ children }: { children: React.ReactNode }) => {
//     // Easy to swap between env and state
//     const siteName = process.env.REACT_APP_SITE_NAME || 'NeoDesigns Hosting';
//     // const siteName = useStoreState((state) => state.settings.data!.name) || 'NeoDesigns Hosting';

//     return (
//         <div css={tw`min-h-screen flex items-center justify-center p-4`} style={{ backgroundColor: '#1a1a1a' }}>
//             <Wrapper>
//                 <FlashMessageRender css={tw`mb-4 px-1`} />
//                 <FormWrapper>
//                     <div css={tw`text-center mb-6`}>
//                         <h2 css={tw`text-3xl text-white font-bold mb-2`}>{siteName}</h2>
//                         <p css={tw`text-gray-400 text-sm`}>Sign in to your account to continue</p>
//                     </div>
//                     {children}
//                 </FormWrapper>
//             </Wrapper>
//         </div>
//     );
// };

// export default DiscordFormContainer;

import React from 'react';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import FlashMessageRender from '@/components/FlashMessageRender';

const Wrapper = styled.div`
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
        ${tw`w-full`}
        max-width: 500px;
    `};
`;

const FormWrapper = styled.div`
    ${tw`w-full bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-700`}
`;

const DiscordFormContainer = ({ children }: { children: React.ReactNode }) => {
    // Easy to swap between env and state
    const siteName = process.env.REACT_APP_SITE_NAME || 'NeoDesigns Hosting';
    // const siteName = useStoreState((state) => state.settings.data!.name) || 'NeoDesigns Hosting';

    return (
        <div css={tw`min-h-screen flex items-center justify-center p-4`} style={{ backgroundColor: '#1a1a1a', margin: 0, overflow: 'hidden' }}>
            <Wrapper css={tw`my-auto`}>
                <FlashMessageRender css={tw`mb-4 px-1`} />
                <FormWrapper>
                    <div css={tw`text-center mb-6`}>
                        <h2 css={tw`text-3xl text-white font-bold mb-2`}>{siteName}</h2>
                        <p css={tw`text-gray-400 text-sm`}>Sign in to your account to continue</p>
                    </div>
                    {children}
                </FormWrapper>
            </Wrapper>
        </div>
    );
};

export default DiscordFormContainer;