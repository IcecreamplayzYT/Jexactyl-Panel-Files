// import React from 'react';
// import tw from 'twin.macro';
// import http from '@/api/http';
// import * as Icon from 'react-feather';
// import { useStoreState } from 'easy-peasy';
// import styled from 'styled-components/macro';
// import { NavLink, Link } from 'react-router-dom';
// import ProgressBar from '@/components/elements/ProgressBar';
// import Tooltip from '@/components/elements/tooltip/Tooltip';
// import SearchContainer from '@/components/dashboard/search/SearchContainer';

// export default () => {
//     const logo = useStoreState((state) => state.settings.data?.logo);
//     const tickets = useStoreState((state) => state.settings.data!.tickets);
//     const store = useStoreState((state) => state.storefront.data!.enabled);
//     const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);

//     const onTriggerLogout = () => {
//         http.post('/auth/logout').finally(() => {
//             // @ts-expect-error this is valid
//             window.location = '/';
//         });
//     };

//     const PanelDiv = styled.div`
//         ${tw`h-screen sticky bg-neutral-800 flex flex-col w-20 fixed top-0`};

//         & > div {
//             ${tw`mx-auto`};

//             & > a,
//             & > div {
//                 &:hover {
//                     ${tw`text-neutral-100`};
//                 }

//                 &:active,
//                 &.active {
//                     ${tw`text-green-600`};
//                 }
//             }
//         }
//     `;

//     return (
//         <PanelDiv>
//             <ProgressBar />
//             <Link to={'/'}>
//                 <img className={'p-2'} src={logo ?? 'https://avatars.githubusercontent.com/u/91636558'} />
//             </Link>
//             <div>
//                 <div className={'navigation-link'}>
//                     <div className={'bg-gray-700 rounded-lg p-2 my-8'}>
//                         <SearchContainer size={32} />
//                     </div>
//                 </div>
//                 <NavLink to={'/'} className={'navigation-link'} exact>
//                     <Tooltip placement={'bottom'} content={'Servers'}>
//                         <div className={'bg-gray-700 rounded-lg p-2 my-8'}>
//                             <Icon.Server size={32} />
//                         </div>
//                     </Tooltip>
//                 </NavLink>
//                 <NavLink to={'/account'} className={'navigation-link'}>
//                     <Tooltip placement={'bottom'} content={'Account'}>
//                         <div className={'bg-gray-700 rounded-lg p-2 my-8'}>
//                             <Icon.User size={32} />
//                         </div>
//                     </Tooltip>
//                 </NavLink>
//                 {store && (
//                     <NavLink to={'/store'} className={'navigation-link'}>
//                         <Tooltip placement={'bottom'} content={'Store'}>
//                             <div className={'bg-gray-700 rounded-lg p-2 my-8'}>
//                                 <Icon.ShoppingCart size={32} />
//                             </div>
//                         </Tooltip>
//                     </NavLink>
//                 )}
//                 {tickets && (
//                     <NavLink to={'/tickets'} className={'navigation-link'}>
//                         <Tooltip placement={'bottom'} content={'Tickets'}>
//                             <div className={'bg-gray-700 rounded-lg p-2 my-8'}>
//                                 <Icon.HelpCircle size={32} />
//                             </div>
//                         </Tooltip>
//                     </NavLink>
//                 )}
//                 {rootAdmin && (
//                     <a href={'/admin'} className={'navigation-link'}>
//                         <Tooltip placement={'bottom'} content={'Admin'}>
//                             <div className={'bg-gray-700 rounded-lg p-2 my-8'}>
//                                 <Icon.Settings size={32} />
//                             </div>
//                         </Tooltip>
//                     </a>
//                 )}
//                 <div id={'logo'}>
//                     <button onClick={onTriggerLogout} className={'navigation-link'}>
//                         <Tooltip placement={'bottom'} content={'Logout'}>
//                             <div className={'flex flex-row fixed bottom-0 mb-8 bg-gray-700 rounded-lg p-2'}>
//                                 <Icon.LogOut size={32} />
//                             </div>
//                         </Tooltip>
//                     </button>
//                 </div>
//             </div>
//         </PanelDiv>
//     );
// };

import React from 'react';
import tw from 'twin.macro';
import http from '@/api/http';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import { NavLink, Link } from 'react-router-dom';
import ProgressBar from '@/components/elements/ProgressBar';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import SearchContainer from '@/components/dashboard/search/SearchContainer';

export default () => {
    const logo = useStoreState((state) => state.settings.data?.logo);
    const tickets = useStoreState((state) => state.settings.data!.tickets);
    const store = useStoreState((state) => state.storefront.data!.enabled);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);

    const onTriggerLogout = () => {
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const PanelDiv = styled.div`
        ${tw`fixed left-0 top-0 h-screen w-32 flex flex-col items-center py-6 gap-3 z-50`};
        background-color: hsl(0, 0%, 10%);
        border-right: 1px solid hsl(0, 0%, 15%);
    `;

    const LogoBox = styled(Link)`
        ${tw`w-20 h-20 flex items-center justify-center mb-4 transition-all duration-200`};

        & img {
            ${tw`w-20 h-20 rounded object-cover`};
        }

        &:hover {
            opacity: 0.8;
        }
    `;

    const NavContainer = styled.nav`
        ${tw`flex-1 flex flex-col gap-3 w-full px-6 mt-4 items-center`};
    `;

    const NavItemWrapper = styled.div`
        ${tw`relative w-full flex justify-center`};
    `;

    const ActiveAccent = styled.div`
        ${tw`absolute -left-3 w-1 h-8 rounded-r-full transition-all duration-200`};
        background-color: rgb(239, 68, 68);
        opacity: 0;
        top: 50%;
        transform: translateY(-50%);
        box-shadow: 20px 0px 30px rgba(239, 68, 68, 0.7);
    `;

    const NavIconLink = styled(NavLink)`
        ${tw`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 relative`};
        background-color: transparent;
        color: hsl(0, 0%, 60%);
        border: none;
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: hsl(0, 0%, 18%);
            color: white;
        }

        &.active {
            background-color: hsl(0, 0%, 18%);
            color: white;

            & ${ActiveAccent} {
                opacity: 1;
            }
        }

        & svg {
            ${tw`transition-all duration-200`};
            stroke-width: 2;
        }

        &:hover svg {
            ${tw`scale-110`};
        }
    `;

    const SearchBox = styled.button`
        ${tw`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 border-none cursor-pointer`};
        background-color: transparent;
        color: hsl(0, 0%, 60%);
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: hsl(0, 0%, 18%);
            color: white;
        }

        & svg {
            ${tw`transition-all duration-200`};
        }

        &:hover svg {
            ${tw`scale-110`};
        }
    `;

    const LogoutBtn = styled.button`
        ${tw`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 border-none cursor-pointer mt-auto mb-2`};
        background-color: hsl(0, 0%, 18%);
        color: hsl(0, 0%, 60%);

        &:hover {
            background-color: hsl(0, 0%, 25%);
            color: white;
        }

        & svg {
            ${tw`transition-all duration-200`};
            stroke-width: 2;
        }

        &:hover svg {
            ${tw`scale-110`};
        }
    `;

    return (
        <PanelDiv>
            <LogoBox to={'/'}>
                <img src={logo ?? 'https://avatars.githubusercontent.com/u/91636558'} alt='Logo' />
            </LogoBox>

            <NavContainer>
                <SearchBox>
                    <SearchContainer size={24} />
                </SearchBox>

                <NavItemWrapper>
                    <Tooltip placement={'right'} content={'Servers'}>
                        <NavIconLink to={'/'} exact>
                            <Icon.Server size={24} />
                            <ActiveAccent />
                        </NavIconLink>
                    </Tooltip>
                </NavItemWrapper>

                <NavItemWrapper>
                    <Tooltip placement={'right'} content={'Account'}>
                        <NavIconLink to={'/account'}>
                            <Icon.User size={24} />
                            <ActiveAccent />
                        </NavIconLink>
                    </Tooltip>
                </NavItemWrapper>

                {store && (
                    <NavItemWrapper>
                        <Tooltip placement={'right'} content={'Store'}>
                            <NavIconLink to={'/store'}>
                                <Icon.ShoppingCart size={24} />
                                <ActiveAccent />
                            </NavIconLink>
                        </Tooltip>
                    </NavItemWrapper>
                )}

                {tickets && (
                    <NavItemWrapper>
                        <Tooltip placement={'right'} content={'Tickets'}>
                            <NavIconLink to={'/tickets'}>
                                <Icon.HelpCircle size={24} />
                                <ActiveAccent />
                            </NavIconLink>
                        </Tooltip>
                    </NavItemWrapper>
                )}

                {rootAdmin && (
                    <NavItemWrapper>
                        <Tooltip placement={'right'} content={'Admin'}>
                            <NavIconLink as='a' href={'/admin'}>
                                <Icon.Settings size={24} />
                            </NavIconLink>
                        </Tooltip>
                    </NavItemWrapper>
                )}
            </NavContainer>

            <Tooltip placement={'right'} content={'Logout'}>
                <LogoutBtn onClick={onTriggerLogout}>
                    <Icon.LogOut size={24} />
                </LogoutBtn>
            </Tooltip>
        </PanelDiv>
    );
};
