// import tw from 'twin.macro';
// import React, { useEffect } from 'react';
// import { useStoreState } from '@/state/hooks';
// import { Alert } from '@/components/elements/alert';
// import { CSSTransition } from 'react-transition-group';
// import FlashMessageRender from '@/components/FlashMessageRender';
// import ContentContainer from '@/components/elements/ContentContainer';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDiscord } from '@fortawesome/free-brands-svg-icons';
// import { faGlobe, faShieldAlt, faFileContract } from '@fortawesome/free-solid-svg-icons';

// export interface PageContentBlockProps {
//     title?: string;
//     description?: string | null;
//     className?: string;
//     showFlashKey?: string;
// }

// const PageContentBlock: React.FC<PageContentBlockProps> = ({
//     title,
//     description,
//     showFlashKey,
//     className,
//     children,
// }) => {
//     const alert = useStoreState((state) => state.settings.data!.alert);

//     useEffect(() => {
//         if (title) {
//             document.title = title;
//         }
//     }, [title]);

//     return (
//         <CSSTransition timeout={150} classNames={'fade'} appear in>
//             <div css={tw`my-4`}>
//                 <ContentContainer className={className}>
//                     {alert.message && (
//                         <Alert type={alert.type} className={'my-4'}>
//                             {alert.message}
//                         </Alert>
//                     )}
//                     {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`my-4`} />}
//                     {description && (
//                         <div className={'my-10 j-left'}>
//                             <h1 className={'text-5xl'}>{title}</h1>
//                             <h3 className={'text-2xl text-neutral-500'}>{description}</h3>
//                         </div>
//                     )}
//                     {children}
//                 </ContentContainer>
//                 <ContentContainer css={tw`text-sm text-center my-4 pb-8`}>
//                     <p css={tw`text-neutral-500 sm:text-center`}>
//                         &copy; <a href={'https://discord.gg/neodesigns'}>Neo Designs Panel,</a> built on{' '}
//                         <a href={'https://jexactyl.com'}>Jexactyl.</a>
//                     </p>
//                     {/* <p css={tw`text-neutral-500 sm:float-right`}>
//                         <a href={'https://jexactyl.com'}> Site </a>
//                         &bull;
//                         <a href={'https://github.com/jexactyl/jexactyl'}> GitHub </a>
//                     </p> */}
//                 </ContentContainer>
//                 {/* Moved bottom links to end of scrolling content */}
//                 <ContentContainer css={tw`text-center py-4 border-t border-neutral-800 bg-transparent`}>
//                     <div css={tw`flex justify-center items-center gap-8 flex-wrap`}>
//                         <a
//                             href='https://discord.gg/neodesigns'
//                             target='_blank'
//                             rel='noopener noreferrer'
//                             css={tw`flex items-center gap-2 text-neutral-300 hover:text-[#5865F2] transition-colors text-base`}
//                         >
//                             <FontAwesomeIcon icon={faDiscord} size='lg' />
//                             Discord
//                         </a>
//                         <a
//                             href='https://hosting.vervecustoms.com/home'
//                             target='_blank'
//                             rel='noopener noreferrer'
//                             css={tw`flex items-center gap-2 text-neutral-300 hover:text-cyan-400 transition-colors text-base`}
//                         >
//                             <FontAwesomeIcon icon={faGlobe} size='lg' />
//                             Website
//                         </a>
//                         <a
//                             href='https://hosting.vervecustoms.com/docs/privacy'
//                             css={tw`flex items-center gap-2 text-neutral-300 hover:text-green-400 transition-colors text-base`}
//                         >
//                             <FontAwesomeIcon icon={faShieldAlt} size='lg' />
//                             Privacy Policy
//                         </a>
//                         <a
//                             href='https://hosting.vervecustoms.com/docs/terms'
//                             css={tw`flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors text-base`}
//                         >
//                             <FontAwesomeIcon icon={faFileContract} size='lg' />
//                             Terms of Service
//                         </a>
//                     </div>
//                 </ContentContainer>
//             </div>
//         </CSSTransition>
//     );
// };

// export default PageContentBlock;

import React, { useEffect } from 'react';
import styled from 'styled-components/macro';

export interface PageContentBlockProps {
    title?: string;
    description?: string | null;
    className?: string;
    logo?: string;
    children?: React.ReactNode;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({
    title,
    description,
    className,
    logo = 'https://i.imgur.com/co0rkcI.png',
    children,
}) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    // --- Styled Components Definitions ---

    const Container = styled.div`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        /* FIX: Removed background-color: #000; to make the main content area transparent */
    `;

    const Content = styled.div`
        flex: 1;
        padding: 2rem;
        max-width: 80rem;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
    `;

    const TitleSection = styled.div`
        margin-bottom: 2.5rem;
        padding-top: 1rem;
    `;

    const MainTitle = styled.h1`
        font-size: 3rem;
        font-weight: bold;
        color: #f5f5f5;
        margin-bottom: 0.5rem;
    `;

    const SubDescription = styled.h3`
        font-size: 1.5rem;
        color: #a3a3a3;
        font-weight: 300;
    `;

    const FooterContainer = styled.div`
        /* FIX: Changed background-color: #000 to transparent */
        background-color: transparent;
        color: #a3a3a3;
        padding: 4rem 2rem;
        /* The border-top is kept to visually separate the footer */
        border-top: 1px solid #404040;
    `;

    const FooterContent = styled.div`
        max-width: 80rem;
        margin: 0 auto;
    `;

    const FooterGrid = styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 3rem;
        margin-bottom: 3rem;
    `;

    const FooterSection = styled.div`
        display: flex;
        flex-direction: column;
    `;

    const SectionTitle = styled.h3`
        font-weight: 600;
        color: #f5f5f5;
        margin-bottom: 1rem;
        font-size: 1rem;
    `;

    const SectionLink = styled.a`
        color: #737373;
        text-decoration: none;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
        transition: color 0.3s ease;

        &:hover {
            color: #d4d4d8;
        }
    `;

    const Logo = styled.img`
        height: 3rem;
        margin-bottom: 1rem;
        object-fit: contain;
    `;

    const LogoSection = styled.div`
        margin-bottom: 2rem;
    `;

    const LogoText = styled.h2`
        font-size: 1.5rem;
        font-weight: bold;
        color: #f5f5f5;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    const Description = styled.p`
        color: #737373;
        font-size: 0.875rem;
        line-height: 1.6;
        max-width: 20rem;
    `;

    const Divider = styled.hr`
        border: none;
        border-top: 1px solid #404040;
        margin: 2rem 0;
    `;

    const BottomBar = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 2rem;
        border-top: 1px solid #404040;
        flex-wrap: wrap;
        gap: 1rem;
    `;

    const Copyright = styled.p`
        color: #737373;
        font-size: 0.875rem;
        margin: 0;
    `;

    const StatusBadge = styled.div`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid #22c55e;
        border-radius: 0.5rem;
        color: #22c55e;
        font-size: 0.875rem;

        &::before {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #22c55e;
            border-radius: 9999px;
            content: '';
            display: block;
        }
    `;

    // --- Component Render ---

    return (
        <Container>
            <Content className={className}>
                {description && (
                    <TitleSection>
                        <MainTitle>{title}</MainTitle>
                        <SubDescription>{description}</SubDescription>
                    </TitleSection>
                )}
                {children}
            </Content>

            <FooterContainer>
                <FooterContent>
                    <FooterGrid>
                        <FooterSection>
                            <LogoSection>
                                <Logo src={logo} alt='Logo' />
                                <LogoText>NeoDesigns</LogoText>
                            </LogoSection>
                            <Description>
                                NeoDesigns is a collaborative and dynamic design server built to inspire creativity and
                                connection. Explore our range of design services and join a growing creative community.
                            </Description>
                        </FooterSection>

                        <FooterSection>
                            <SectionTitle>NeoDesigns</SectionTitle>
                            <SectionLink href='https://google.com'>Homepage</SectionLink>
                            <SectionLink href='https://discord.gg/neodesigns'>Contact Us</SectionLink>
                            <SectionLink href='https://discord.gg/neodesigns'>Join Our Team</SectionLink>
                        </FooterSection>

                        <FooterSection>
                            <SectionTitle>Legal</SectionTitle>
                            <SectionLink href='https://hosting.vervecustoms.com/docs/terms'>
                                Terms of Service
                            </SectionLink>
                            <SectionLink href='https://hosting.vervecustoms.com/docs/privacy'>
                                Privacy Policy
                            </SectionLink>
                        </FooterSection>
                    </FooterGrid>

                    <Divider />

                    <BottomBar>
                        <Copyright>
                            <p>Copyright &copy; {new Date().getFullYear()} NeoDesigns. All Rights Reserved</p>
                        </Copyright>
                        <StatusBadge>All systems operational</StatusBadge>
                    </BottomBar>
                </FooterContent>
            </FooterContainer>
        </Container>
    );
};

export default PageContentBlock;
