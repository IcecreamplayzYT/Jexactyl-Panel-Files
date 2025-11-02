// // import tw from 'twin.macro';
// // import * as Icon from 'react-feather';
// // import { Link } from 'react-router-dom';
// // import styled from 'styled-components/macro';
// // import { Server } from '@/api/server/getServer';
// // import Spinner from '@/components/elements/Spinner';
// // import { bytesToString, ip } from '@/lib/formatters';
// // import GreyRowBox from '@/components/elements/GreyRowBox';
// // import React, { useEffect, useRef, useState } from 'react';
// // import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';

// // // Determines if the current value is in an alarm threshold so we can show it in red rather
// // // than the more faded default style.
// // const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

// // const IconDescription = styled.p<{ $alarm?: boolean }>`
// //     ${tw`text-sm ml-2`};
// //     ${(props) => props.$alarm && tw`text-red-300`};
// // `;

// // const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined; $bg: string }>`
// //     ${tw`grid grid-cols-12 gap-4 relative`};

// //     ${({ $bg }) => `background-image: url("${$bg}");`}
// //     background-position: center;
// //     background-repeat: no-repeat;
// //     background-size: cover;

// //     & .status-bar {
// //         ${tw`w-4 h-4 bg-red-500 absolute right-0 top-0 z-20 rounded-full m-2 transition-all duration-150 animate-pulse`};

// //         ${({ $status }) =>
// //             !$status || $status === 'offline'
// //                 ? tw`bg-red-500`
// //                 : $status === 'running'
// //                 ? tw`bg-green-500`
// //                 : tw`bg-yellow-500`};
// //     }

// //     &:hover .status-bar {
// //         ${tw`opacity-75`};
// //     }
// // `;

// // type Timer = ReturnType<typeof setInterval>;

// // export default ({ server, className }: { server: Server; className?: string }) => {
// //     const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
// //     const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
// //     const [stats, setStats] = useState<ServerStats | null>(null);

// //     const getStats = () =>
// //         getServerResourceUsage(server.uuid)
// //             .then((data) => setStats(data))
// //             .catch((error) => console.error(error));

// //     useEffect(() => {
// //         setIsSuspended(stats?.isSuspended || server.status === 'suspended');
// //     }, [stats?.isSuspended, server.status]);

// //     useEffect(() => {
// //         // Don't waste a HTTP request if there is nothing important to show to the user because
// //         // the server is suspended.
// //         if (isSuspended) return;

// //         getStats().then(() => {
// //             interval.current = setInterval(() => getStats(), 30000);
// //         });

// //         return () => {
// //             interval.current && clearInterval(interval.current);
// //         };
// //     }, [isSuspended]);

// //     const alarms = { cpu: false, memory: false, disk: false };
// //     if (stats) {
// //         alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
// //         alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
// //     }

// //     return (
// //         <StatusIndicatorBox
// //             as={Link}
// //             to={`/server/${server.id}`}
// //             className={className}
// //             $status={stats?.status}
// //             $bg={server.bg}
// //         >
// //             <div css={tw`hidden col-span-12 w-full sm:flex items-baseline justify-center items-center text-center`}>
// //                 <div>
// //                     <p css={tw`text-xl font-medium break-words m-2 text-gray-200`}>{server.name}</p>
// //                     <p css={tw`text-sm text-neutral-400 break-words line-clamp-1 mb-2`}>
// //                         {server.allocations
// //                             .filter((alloc) => alloc.isDefault)
// //                             .map((allocation) => (
// //                                 <React.Fragment key={allocation.ip + allocation.port.toString()}>
// //                                     {allocation.alias || ip(allocation.ip)}:{allocation.port}
// //                                 </React.Fragment>
// //                             ))}
// //                     </p>
// //                 </div>
// //                 {!stats ||
// //                     (isSuspended &&
// //                         (isSuspended ? (
// //                             <div css={tw`flex-1 text-center`}>
// //                                 <span css={tw`bg-red-500 rounded px-2 py-1 text-red-100 text-xs`}>
// //                                     {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
// //                                 </span>
// //                             </div>
// //                         ) : server.isTransferring || server.status ? (
// //                             <div css={tw`flex-1 text-center`}>
// //                                 <span css={tw`bg-neutral-500 rounded px-2 py-1 text-neutral-100 text-xs`}>
// //                                     {server.isTransferring
// //                                         ? 'Transferring'
// //                                         : server.status === 'installing'
// //                                         ? 'Installing'
// //                                         : server.status === 'restoring_backup'
// //                                         ? 'Restoring Backup'
// //                                         : 'Unavailable'}
// //                                 </span>
// //                             </div>
// //                         ) : (
// //                             <Spinner size={'small'} />
// //                         )))}
// //             </div>
// //             {stats && (
// //                 <div css={tw`hidden col-span-12 sm:flex items-baseline justify-center items-center`}>
// //                     <React.Fragment>
// //                         <div css={tw`flex-1 sm:block hidden`}>
// //                             <div css={tw`flex justify-center text-neutral-500`}>
// //                                 <Icon.Cpu size={20} />
// //                                 <IconDescription $alarm={alarms.cpu}>
// //                                     {stats.cpuUsagePercent.toFixed(2)}%
// //                                 </IconDescription>
// //                             </div>
// //                         </div>
// //                         <div css={tw`flex-1 sm:block hidden`}>
// //                             <div css={tw`flex justify-center text-gray-500`}>
// //                                 <Icon.PieChart size={20} />
// //                                 <IconDescription $alarm={alarms.memory}>
// //                                     {bytesToString(stats.memoryUsageInBytes)}
// //                                 </IconDescription>
// //                             </div>
// //                         </div>
// //                         <div css={tw`flex-1 sm:block hidden`}>
// //                             <div css={tw`flex justify-center text-gray-500`}>
// //                                 <Icon.HardDrive size={20} />
// //                                 <IconDescription>{bytesToString(stats?.diskUsageInBytes)}</IconDescription>
// //                             </div>
// //                         </div>
// //                     </React.Fragment>
// //                 </div>
// //             )}
// //             <div className={'status-bar'} />
// //         </StatusIndicatorBox>
// //     );
// // };

// import tw from 'twin.macro';
// import * as Icon from 'react-feather';
// import { Link } from 'react-router-dom';
// import styled from 'styled-components/macro';
// import { Server } from '@/api/server/getServer';
// import Spinner from '@/components/elements/Spinner';
// import { bytesToString, ip } from '@/lib/formatters';
// import GreyRowBox from '@/components/elements/GreyRowBox';
// import React, { useEffect, useRef, useState } from 'react';
// import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';

// const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

// const StyledCardContainer = styled.div<{ $bg: string; $status: ServerPowerState | undefined }>`
//     ${tw`relative overflow-hidden rounded-xl p-8 transition-all duration-300 block`};
//     background-color: hsl(0, 0%, 12%);
//     border: 1px solid hsl(0, 0%, 20%);
//     display: flex;
//     flex-direction: column;
//     gap: 2rem;
//     text-decoration: none;
//     color: inherit;
//     min-height: 200px;

//     &:hover {
//         border-color: hsl(0, 0%, 30%);
//         ${tw`shadow-lg`};
//     }

//     ${({ $bg }) =>
//         $bg &&
//         `
//         &::before {
//             content: '';
//             position: absolute;
//             inset: 0;
//             background-image: url("${$bg}");
//             background-position: center;
//             background-repeat: no-repeat;
//             background-size: cover;
//             opacity: 0.15;
//             z-index: 0;
//         }
//     `}

//     & > * {
//         position: relative;
//         z-index: 10;
//     }

//     & .status-bar {
//         ${tw`w-3 h-3 absolute top-4 right-4 z-20 rounded-full transition-all duration-200`};

//         ${({ $status }) => {
//             if (!$status || $status === 'offline') {
//                 return `
//                     background-color: rgb(239, 68, 68);
//                     box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
//                 `;
//             } else if ($status === 'running') {
//                 return `
//                     background-color: rgb(34, 197, 94);
//                     box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
//                 `;
//             } else {
//                 return `
//                     background-color: rgb(234, 179, 8);
//                     box-shadow: 0 0 12px rgba(234, 179, 8, 0.5);
//                 `;
//             }
//         }}
//     }
// `;

// const StatusIndicatorBox = styled(Link)`
//     ${tw`no-underline`};
//     all: unset;

//     & a {
//         text-decoration: none;
//         color: inherit;
//     }
// `;

// const ServerHeader = styled.div`
//     ${tw`flex-1`};
// `;

// const ServerName = styled.h3`
//     ${tw`text-xl font-semibold mb-1 transition-colors`};
//     color: white;

//     ${StatusIndicatorBox}:hover & {
//         color: rgb(34, 197, 94);
//     }
// `;

// const ServerAddress = styled.p`
//     ${tw`text-sm break-words line-clamp-1`};
//     color: hsl(0, 0%, 50%);
// `;

// const StatusBadge = styled.div<{ $type?: string }>`
//     ${tw`inline-block rounded-md px-3 py-1 text-xs font-semibold border`};

//     ${({ $type }) => {
//         if ($type === 'suspended') {
//             return `
//                 background-color: rgba(239, 68, 68, 0.2);
//                 color: rgb(248, 113, 113);
//                 border-color: rgba(239, 68, 68, 0.3);
//             `;
//         } else if ($type === 'error') {
//             return `
//                 background-color: rgba(239, 68, 68, 0.2);
//                 color: rgb(248, 113, 113);
//                 border-color: rgba(239, 68, 68, 0.3);
//             `;
//         } else if ($type === 'transferring') {
//             return `
//                 background-color: rgba(59, 130, 246, 0.2);
//                 color: rgb(147, 197, 253);
//                 border-color: rgba(59, 130, 246, 0.3);
//             `;
//         } else if ($type === 'installing') {
//             return `
//                 background-color: rgba(168, 85, 247, 0.2);
//                 color: rgb(221, 214, 254);
//                 border-color: rgba(168, 85, 247, 0.3);
//             `;
//         } else if ($type === 'restoring') {
//             return `
//                 background-color: rgba(234, 179, 8, 0.2);
//                 color: rgb(253, 230, 138);
//                 border-color: rgba(234, 179, 8, 0.3);
//             `;
//         } else {
//             return `
//                 background-color: rgba(107, 114, 128, 0.2);
//                 color: rgb(209, 213, 219);
//                 border-color: rgba(107, 114, 128, 0.3);
//             `;
//         }
//     }}
// `;

// const StatsGrid = styled.div`
//     ${tw`grid grid-cols-3 gap-8`};
//     width: 100%;
// `;

// const StatItem = styled.div`
//     ${tw`flex items-center gap-2`};
//     flex: 1;
// `;

// const StatIcon = styled.div<{ $alarm?: boolean }>`
//     ${tw`w-6 h-6 rounded-lg flex items-center justify-center transition-colors flex-shrink-0`};
//     color: ${(props) => (props.$alarm ? 'rgb(239, 68, 68)' : 'white')};
// `;

// const StatValue = styled.span<{ $alarm?: boolean }>`
//     ${tw`text-sm font-semibold`};
//     color: ${(props) => (props.$alarm ? 'rgb(239, 68, 68)' : 'white')};
// `;

// const StatLabel = styled.p`
//     ${tw`text-xs`};
//     color: hsl(0, 0%, 50%);
//     margin: 0;
// `;

// type Timer = ReturnType<typeof setInterval>;

// export default ({ server, className }: { server: Server; className?: string }) => {
//     const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
//     const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
//     const [stats, setStats] = useState<ServerStats | null>(null);

//     const getStats = () =>
//         getServerResourceUsage(server.uuid)
//             .then((data) => setStats(data))
//             .catch((error) => console.error(error));

//     useEffect(() => {
//         setIsSuspended(stats?.isSuspended || server.status === 'suspended');
//     }, [stats?.isSuspended, server.status]);

//     useEffect(() => {
//         if (isSuspended) return;

//         getStats().then(() => {
//             interval.current = setInterval(() => getStats(), 30000);
//         });

//         return () => {
//             interval.current && clearInterval(interval.current);
//         };
//     }, [isSuspended]);

//     const alarms = { cpu: false, memory: false, disk: false };
//     if (stats) {
//         alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
//         alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
//     }

//     const getStatusType = () => {
//         if (server.status === 'suspended') return 'suspended';
//         if (server.isTransferring) return 'transferring';
//         if (server.status === 'installing') return 'installing';
//         if (server.status === 'restoring_backup') return 'restoring';
//         if (server.status) return 'error';
//         return undefined;
//     };

//     return (
//         <Link to={`/server/${server.id}`} style={{ textDecoration: 'none', display: 'block' }}>
//             <StyledCardContainer $status={stats?.status} $bg={server.bg}>
//                 <ServerHeader>
//                     <ServerName>{server.name}</ServerName>
//                     <ServerAddress>
//                         {server.allocations
//                             .filter((alloc) => alloc.isDefault)
//                             .map((allocation) => (
//                                 <React.Fragment key={allocation.ip + allocation.port.toString()}>
//                                     {allocation.alias || ip(allocation.ip)}:{allocation.port}
//                                 </React.Fragment>
//                             ))}
//                     </ServerAddress>
//                 </ServerHeader>

//                 {!stats || isSuspended ? (
//                     <div>
//                         {isSuspended ? (
//                             <StatusBadge $type={server.status === 'suspended' ? 'suspended' : 'error'}>
//                                 {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
//                             </StatusBadge>
//                         ) : server.isTransferring || server.status ? (
//                             <StatusBadge $type={getStatusType()}>
//                                 {server.isTransferring
//                                     ? 'Transferring'
//                                     : server.status === 'installing'
//                                     ? 'Installing'
//                                     : server.status === 'restoring_backup'
//                                     ? 'Restoring Backup'
//                                     : 'Unavailable'}
//                             </StatusBadge>
//                         ) : (
//                             <Spinner size={'small'} />
//                         )}
//                     </div>
//                 ) : (
//                     <StatsGrid>
//                         <StatItem>
//                             <StatIcon $alarm={alarms.cpu}>
//                                 <Icon.Cpu size={20} />
//                             </StatIcon>
//                             <StatValue $alarm={alarms.cpu}>{stats.cpuUsagePercent.toFixed(2)}%</StatValue>
//                             <StatLabel>CPU</StatLabel>
//                         </StatItem>
//                         <StatItem>
//                             <StatIcon $alarm={alarms.memory}>
//                                 <Icon.PieChart size={20} />
//                             </StatIcon>
//                             <StatValue $alarm={alarms.memory}>{bytesToString(stats.memoryUsageInBytes)}</StatValue>
//                             <StatLabel>Memory</StatLabel>
//                         </StatItem>
//                         <StatItem>
//                             <StatIcon>
//                                 <Icon.HardDrive size={20} />
//                             </StatIcon>
//                             <StatValue>{bytesToString(stats?.diskUsageInBytes)}</StatValue>
//                             <StatLabel>Disk</StatLabel>
//                         </StatItem>
//                     </StatsGrid>
//                 )}

//                 <div className={'status-bar'} />
//             </StyledCardContainer>
//         </Link>
//     );
// };

import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Server } from '@/api/server/getServer';
import Spinner from '@/components/elements/Spinner';
import { bytesToString, ip } from '@/lib/formatters';
import React, { useEffect, useRef, useState } from 'react';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const StyledCardContainer = styled.div<{ $bg: string; $status: ServerPowerState | undefined }>`
    ${tw`relative overflow-hidden rounded-xl p-8 transition-all duration-300 block`};
    background-color: hsl(0, 0%, 12%);
    border: 1px solid hsl(0, 0%, 20%);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    text-decoration: none;
    color: inherit;
    min-height: 200px;

    &:hover {
        border-color: hsl(0, 0%, 30%);
        ${tw`shadow-lg`};
    }

    ${({ $bg }) =>
        $bg &&
        `
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("${$bg}");
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            opacity: 0.15;
            z-index: 0;
        }
    `}

    & > * {
        position: relative;
        z-index: 10;
    }

    & .status-bar {
        ${tw`w-3 h-3 absolute top-4 right-4 z-20 rounded-full transition-all duration-200`};

        ${({ $status }) => {
            if (!$status || $status === 'offline') {
                return `
                    background-color: rgb(239, 68, 68);
                    box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
                `;
            } else if ($status === 'running') {
                return `
                    background-color: rgb(34, 197, 94);
                    box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
                `;
            } else {
                return `
                    background-color: rgb(234, 179, 8);
                    box-shadow: 0 0 12px rgba(234, 179, 8, 0.5);
                `;
            }
        }}
    }

    @media (max-width: 1280px) {
        padding: 1rem;
        gap: 1rem;
        min-height: auto;
    }
`;

const StatusIndicatorBox = styled(Link)`
    ${tw`no-underline`};
    all: unset;

    & a {
        text-decoration: none;
        color: inherit;
    }
`;

const ServerHeader = styled.div`
    ${tw`flex-1`};
`;

const ServerName = styled.h3`
    ${tw`text-xl font-semibold mb-1 transition-colors`};
    color: white;

    ${StatusIndicatorBox}:hover & {
        color: rgb(34, 197, 94);
    }

    @media (max-width: 1280px) {
        font-size: 1rem;
    }
`;

const ServerAddress = styled.p`
    ${tw`text-sm break-words line-clamp-1`};
    color: hsl(0, 0%, 50%);
    margin: 0;

    @media (max-width: 1280px) {
        font-size: 0.75rem;
    }
`;

const StatusBadge = styled.div<{ $type?: string }>`
    ${tw`inline-block rounded-md px-3 py-1 text-xs font-semibold border`};

    ${({ $type }) => {
        if ($type === 'suspended') {
            return `
                background-color: rgba(239, 68, 68, 0.2);
                color: rgb(248, 113, 113);
                border-color: rgba(239, 68, 68, 0.3);
            `;
        } else if ($type === 'error') {
            return `
                background-color: rgba(239, 68, 68, 0.2);
                color: rgb(248, 113, 113);
                border-color: rgba(239, 68, 68, 0.3);
            `;
        } else if ($type === 'transferring') {
            return `
                background-color: rgba(59, 130, 246, 0.2);
                color: rgb(147, 197, 253);
                border-color: rgba(59, 130, 246, 0.3);
            `;
        } else if ($type === 'installing') {
            return `
                background-color: rgba(168, 85, 247, 0.2);
                color: rgb(221, 214, 254);
                border-color: rgba(168, 85, 247, 0.3);
            `;
        } else if ($type === 'restoring') {
            return `
                background-color: rgba(234, 179, 8, 0.2);
                color: rgb(253, 230, 138);
                border-color: rgba(234, 179, 8, 0.3);
            `;
        } else {
            return `
                background-color: rgba(107, 114, 128, 0.2);
                color: rgb(209, 213, 219);
                border-color: rgba(107, 114, 128, 0.3);
            `;
        }
    }}
`;

const StatsGrid = styled.div`
    ${tw`grid grid-cols-3 gap-8`};
    width: 100%;

    @media (max-width: 1280px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
    }
`;

const StatItem = styled.div`
    ${tw`flex items-center gap-2`};
    flex: 1;

    @media (max-width: 1280px) {
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
    }
`;

const StatIcon = styled.div<{ $alarm?: boolean }>`
    ${tw`w-6 h-6 rounded-lg flex items-center justify-center transition-colors flex-shrink-0`};
    color: ${(props) => (props.$alarm ? 'rgb(239, 68, 68)' : 'white')};

    @media (max-width: 1280px) {
        width: 1.25rem;
        height: 1.25rem;

        svg {
            width: 0.875rem;
            height: 0.875rem;
        }
    }
`;

const StatValue = styled.span<{ $alarm?: boolean }>`
    ${tw`text-sm font-semibold`};
    color: ${(props) => (props.$alarm ? 'rgb(239, 68, 68)' : 'white')};

    @media (max-width: 1280px) {
        font-size: 0.7rem;
        line-height: 1;
    }
`;

const StatLabel = styled.p`
    ${tw`text-xs`};
    color: hsl(0, 0%, 50%);
    margin: 0;
    display: none;

    @media (max-width: 1280px) {
        display: block;
        font-size: 0.6rem;
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
    }

    const getStatusType = () => {
        if (server.status === 'suspended') return 'suspended';
        if (server.isTransferring) return 'transferring';
        if (server.status === 'installing') return 'installing';
        if (server.status === 'restoring_backup') return 'restoring';
        if (server.status) return 'error';
        return undefined;
    };

    return (
        <Link to={`/server/${server.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <StyledCardContainer $status={stats?.status} $bg={server.bg}>
                <ServerHeader>
                    <ServerName>{server.name}</ServerName>
                    <ServerAddress>
                        {server.allocations
                            .filter((alloc) => alloc.isDefault)
                            .map((allocation) => (
                                <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                    {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                </React.Fragment>
                            ))}
                    </ServerAddress>
                </ServerHeader>

                {!stats || isSuspended ? (
                    <div>
                        {isSuspended ? (
                            <StatusBadge $type={server.status === 'suspended' ? 'suspended' : 'error'}>
                                {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                            </StatusBadge>
                        ) : server.isTransferring || server.status ? (
                            <StatusBadge $type={getStatusType()}>
                                {server.isTransferring
                                    ? 'Transferring'
                                    : server.status === 'installing'
                                    ? 'Installing'
                                    : server.status === 'restoring_backup'
                                    ? 'Restoring Backup'
                                    : 'Unavailable'}
                            </StatusBadge>
                        ) : (
                            <Spinner size={'small'} />
                        )}
                    </div>
                ) : (
                    <StatsGrid>
                        <StatItem>
                            <StatIcon $alarm={alarms.cpu}>
                                <Icon.Cpu size={20} />
                            </StatIcon>
                            <StatValue $alarm={alarms.cpu}>{stats.cpuUsagePercent.toFixed(2)}%</StatValue>
                            <StatLabel>CPU</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatIcon $alarm={alarms.memory}>
                                <Icon.PieChart size={20} />
                            </StatIcon>
                            <StatValue $alarm={alarms.memory}>{bytesToString(stats.memoryUsageInBytes)}</StatValue>
                            <StatLabel>Memory</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatIcon>
                                <Icon.HardDrive size={20} />
                            </StatIcon>
                            <StatValue>{bytesToString(stats?.diskUsageInBytes)}</StatValue>
                            <StatLabel>Disk</StatLabel>
                        </StatItem>
                    </StatsGrid>
                )}

                <div className={'status-bar'} />
            </StyledCardContainer>
        </Link>
    );
};
