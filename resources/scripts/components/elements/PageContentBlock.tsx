import React, { useEffect, useState } from 'react';
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
    logo = 'https://cdn.vervecustoms.com/banners/neo/Neo-002-Transparent-Sized.png',
    children,
}) => {
    const [statusData, setStatusData] = useState({
        state: 'operational',
        loading: true,
    });

    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    // Fetch status from BetterStack via our backend proxy
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/status.php');

                if (response.ok) {
                    const data = await response.json();
                    setStatusData({
                        state: data.status || 'operational',
                        loading: false,
                    });
                } else {
                    // Fallback to operational
                    setStatusData({ state: 'operational', loading: false });
                }
            } catch (error) {
                console.warn('Could not fetch status:', error);
                // Graceful degradation
                setStatusData({ state: 'operational', loading: false });
            }
        };

        fetchStatus();
        // Refresh every 60 seconds
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    // Get status display config
    const getStatusConfig = () => {
        switch (statusData.state) {
            case 'operational':
                return {
                    text: 'All services are online',
                    color: '#22c55e',
                    dotColor: '#22c55e',
                    shouldPulse: false,
                };
            case 'degraded_performance':
            case 'degraded':
                return {
                    text: 'Degraded performance',
                    color: '#f59e0b',
                    dotColor: '#f59e0b',
                    shouldPulse: true,
                };
            case 'partial_outage':
                return {
                    text: 'Partial outage',
                    color: '#f59e0b',
                    dotColor: '#f59e0b',
                    shouldPulse: true,
                };
            case 'major_outage':
            case 'downtime':
                return {
                    text: 'Major outage',
                    color: '#ef4444',
                    dotColor: '#ef4444',
                    shouldPulse: true,
                };
            case 'maintenance':
                return {
                    text: 'Under maintenance',
                    color: '#3b82f6',
                    dotColor: '#3b82f6',
                    shouldPulse: true,
                };
            default:
                return {
                    text: 'All systems operational',
                    color: '#22c55e',
                    dotColor: '#22c55e',
                    shouldPulse: false,
                };
        }
    };

    const statusConfig = getStatusConfig();

    // --- Styled Components Definitions ---

    const Container = styled.div`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
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
        background-color: transparent;
        color: #a3a3a3;
        padding: 4rem 2rem;
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
        margin: 0;
        object-fit: contain;
        display: block;
    `;

    const LogoSection = styled.div`
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 2rem;

        @media (max-width: 640px) {
            flex-direction: column;
            align-items: flex-start;
        }
    `;

    const LogoText = styled.h2`
        font-size: 1.5rem;
        font-weight: bold;
        color: #f5f5f5;
        margin: 0;
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

    const StatusBadgeWrapper = styled.a<{ statusColor: string; shouldPulse: boolean }>`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid ${(props) => props.statusColor};
        border-radius: 0.5rem;
        color: ${(props) => props.statusColor};
        font-size: 0.875rem;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        background-color: transparent;

        &:hover {
            opacity: 0.8;
        }

        &::before {
            width: 0.5rem;
            height: 0.5rem;
            background-color: ${(props) => props.statusColor};
            border-radius: 9999px;
            content: '';
            display: block;
            animation: ${(props) => (props.shouldPulse ? 'pulse 2s ease-in-out infinite' : 'none')};
        }

        @keyframes pulse {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
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
                                <Logo src={logo} alt='NeoDesigns Logo' />
                                <LogoText>NeoDesigns</LogoText>
                            </LogoSection>
                            <Description>
                                NeoDesigns is a collaborative and dynamic design server built to inspire creativity and
                                connection. Explore our range of design services and join a growing creative community.
                            </Description>
                        </FooterSection>

                        <FooterSection>
                            <SectionTitle>NeoDesigns</SectionTitle>
                            <SectionLink href='https://google.com' target='_blank' rel='noopener noreferrer'>
                                Homepage
                            </SectionLink>
                            <SectionLink href='https://discord.gg/neodesigns' target='_blank' rel='noopener noreferrer'>
                                Contact Us
                            </SectionLink>
                            <SectionLink href='https://discord.gg/neodesigns' target='_blank' rel='noopener noreferrer'>
                                Join Our Team
                            </SectionLink>
                        </FooterSection>

                        <FooterSection>
                            <SectionTitle>Legal</SectionTitle>
                            <SectionLink
                                href='https://hosting.vervecustoms.com/docs/terms'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Terms of Service
                            </SectionLink>
                            <SectionLink
                                href='https://hosting.vervecustoms.com/docs/privacy'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Privacy Policy
                            </SectionLink>
                        </FooterSection>
                    </FooterGrid>

                    <BottomBar>
                        <Copyright>
                            <p>Copyright &copy; {new Date().getFullYear()} NeoDesigns. All Rights Reserved</p>
                        </Copyright>
                        <StatusBadgeWrapper
                            href='https://status.vervecustoms.com'
                            target='_blank'
                            rel='noopener noreferrer'
                            statusColor={statusConfig.color}
                            shouldPulse={statusConfig.shouldPulse}
                        >
                            {statusConfig.text}
                        </StatusBadgeWrapper>
                    </BottomBar>
                </FooterContent>
            </FooterContainer>
        </Container>
    );
};

export default PageContentBlock;
// V3 Code - Added dynamic status badge with BetterStack integration via backend proxy.
