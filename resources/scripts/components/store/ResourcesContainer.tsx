// import tw from 'twin.macro';
// import { breakpoint } from '@/theme';
// import * as Icon from 'react-feather';
// import { Link } from 'react-router-dom';
// import useFlash from '@/plugins/useFlash';
// import styled from 'styled-components/macro';
// import React, { useState, useEffect } from 'react';
// import Spinner from '@/components/elements/Spinner';
// import { Button } from '@/components/elements/button';
// import { Dialog } from '@/components/elements/dialog';
// import { getCosts, Costs } from '@/api/store/getCosts';
// import purchaseResource from '@/api/store/purchaseResource';
// import TitledGreyBox from '@/components/elements/TitledGreyBox';
// import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
// import PurchaseBox from '@/components/elements/store/PurchaseBox';
// import PageContentBlock from '@/components/elements/PageContentBlock';

// const Container = styled.div`
//     ${tw`flex flex-wrap`};

//     & > div {
//         ${tw`w-full`};

//         ${breakpoint('sm')`
//       width: calc(50% - 1rem);
//     `}

//         ${breakpoint('md')`
//       ${tw`w-auto flex-1`};
//     `}
//     }
// `;

// export default () => {
//     const [open, setOpen] = useState(false);
//     const [costs, setCosts] = useState<Costs>();
//     const [resource, setResource] = useState('');
//     const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

//     useEffect(() => {
//         getCosts().then((costs) => setCosts(costs));
//     }, []);

//     const purchase = (resource: string) => {
//         clearFlashes('store:resources');

//         purchaseResource(resource)
//             .then(() => {
//                 setOpen(false);
//                 addFlash({
//                     type: 'success',
//                     key: 'store:resources',
//                     message: 'Resource has been added to your account.',
//                 });
//             })
//             .catch((error) => clearAndAddHttpError({ key: 'store:resources', error }));
//     };

//     if (!costs) return <Spinner size={'large'} centered />;

//     return (
//         <PageContentBlock
//             title={'Buy Resources'}
//             description={'Buy more resources to add to your server.'}
//             showFlashKey={'store:resources'}
//         >
//             <SpinnerOverlay size={'large'} visible={open} />
//             <Dialog.Confirm
//                 open={open}
//                 onClose={() => setOpen(false)}
//                 title={'Confirm resource seletion'}
//                 confirm={'Continue'}
//                 onConfirmed={() => purchase(resource)}
//             >
//                 Are you sure you want to purchase this resource ({resource})? This will take the credits from your
//                 account and add the resource. This is not a reversible transaction.
//             </Dialog.Confirm>
//             <Container className={'lg:grid lg:grid-cols-4 my-10 gap-8'}>
//                 <PurchaseBox
//                     type={'CPU'}
//                     amount={50}
//                     suffix={'%'}
//                     cost={costs.cpu}
//                     setOpen={setOpen}
//                     icon={<Icon.Cpu />}
//                     setResource={setResource}
//                     description={'Buy CPU to improve server load times and performance.'}
//                 />
//                 <PurchaseBox
//                     type={'Memory'}
//                     amount={1}
//                     suffix={'GB'}
//                     cost={costs.memory}
//                     setOpen={setOpen}
//                     icon={<Icon.PieChart />}
//                     setResource={setResource}
//                     description={'Buy RAM to improve overall server performance.'}
//                 />
//                 <PurchaseBox
//                     type={'Disk'}
//                     amount={1}
//                     suffix={'GB'}
//                     cost={costs.disk}
//                     setOpen={setOpen}
//                     icon={<Icon.HardDrive />}
//                     setResource={setResource}
//                     description={'Buy disk to store more files.'}
//                 />
//                 <PurchaseBox
//                     type={'Slots'}
//                     amount={1}
//                     cost={costs.slots}
//                     setOpen={setOpen}
//                     icon={<Icon.Server />}
//                     setResource={setResource}
//                     description={'Buy a server slot so you can deploy a new server.'}
//                 />
//             </Container>
//             <Container className={'lg:grid lg:grid-cols-4 my-10 gap-8'}>
//                 <PurchaseBox
//                     type={'Ports'}
//                     amount={1}
//                     cost={costs.ports}
//                     setOpen={setOpen}
//                     icon={<Icon.Share2 />}
//                     setResource={setResource}
//                     description={'Buy a network port to add to a server.'}
//                 />
//                 <PurchaseBox
//                     type={'Backups'}
//                     amount={1}
//                     cost={costs.backups}
//                     setOpen={setOpen}
//                     icon={<Icon.Archive />}
//                     setResource={setResource}
//                     description={'Buy a backup to keep your data secure.'}
//                 />
//                 <PurchaseBox
//                     type={'Databases'}
//                     amount={1}
//                     cost={costs.databases}
//                     setOpen={setOpen}
//                     icon={<Icon.Database />}
//                     setResource={setResource}
//                     description={'Buy a database to get and set data.'}
//                 />
//                 <TitledGreyBox title={'How to use resources'}>
//                     <p className={'font-semibold'}>Adding to an existing server</p>
//                     <p className={'text-xs text-gray-500'}>
//                         If you have a server that is already deployed, you can add resources to it by going to the
//                         &apos;edit&apos; tab.
//                     </p>
//                     <p className={'font-semibold mt-1'}>Adding to a new server</p>
//                     <p className={'text-xs text-gray-500'}>
//                         You can buy resources and add them to a new server in the server creation page, which you can
//                         access via the store.
//                     </p>
//                 </TitledGreyBox>
//             </Container>
//             <div className={'flex justify-center items-center'}>
//                 <div className={'bg-auto bg-center bg-storeone p-4 m-4 rounded-lg'}>
//                     <div className={'text-center bg-gray-900 bg-opacity-75 p-4'}>
//                         <h1 className={'text-4xl'}>Ready to get started?</h1>
//                         <Link to={'/store/create'}>
//                             <Button.Text className={'w-full mt-4'}>Create a server</Button.Text>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </PageContentBlock>
//     );
// };

import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import { Dialog } from '@/components/elements/dialog';
import { getCosts, Costs } from '@/api/store/getCosts';
import purchaseResource from '@/api/store/purchaseResource';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { ChevronRight } from 'lucide-react';

export default () => {
    const [rotation, setRotation] = useState(0);
    const [selectedResource, setSelectedResource] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [costs, setCosts] = useState<Costs>();
    const [resource, setResource] = useState('');
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    useEffect(() => {
        getCosts().then((costs) => setCosts(costs));
    }, []);

    const resources = [
        {
            id: 'cpu',
            name: 'CPU',
            amount: 50,
            suffix: '%',
            icon: Icon.Cpu,
            description: 'Buy CPU to improve server load times and performance.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            id: 'memory',
            name: 'Memory',
            amount: 1,
            suffix: 'GB',
            icon: Icon.PieChart,
            description: 'Buy RAM to improve overall server performance.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            id: 'disk',
            name: 'Disk',
            amount: 1,
            suffix: 'GB',
            icon: Icon.HardDrive,
            description: 'Buy disk to store more files.',
            color: 'from-orange-500 to-red-500',
        },
        {
            id: 'slots',
            name: 'Slots',
            amount: 1,
            suffix: '',
            icon: Icon.Server,
            description: 'Buy a server slot so you can deploy a new server.',
            color: 'from-green-500 to-emerald-500',
        },
        {
            id: 'ports',
            name: 'Ports',
            amount: 1,
            suffix: '',
            icon: Icon.Share2,
            description: 'Buy a network port to add to a server.',
            color: 'from-yellow-500 to-amber-500',
        },
        {
            id: 'backups',
            name: 'Backups',
            amount: 1,
            suffix: '',
            icon: Icon.Archive,
            description: 'Buy a backup to keep your data secure.',
            color: 'from-indigo-500 to-blue-500',
        },
        {
            id: 'databases',
            name: 'Databases',
            amount: 1,
            suffix: '',
            icon: Icon.Database,
            description: 'Buy a database to get and set data.',
            color: 'from-rose-500 to-pink-500',
        },
    ];

    const handleRotate = (direction: 'next' | 'prev') => {
        const step = 360 / resources.length;
        setRotation((prev) => prev + (direction === 'next' ? step : -step));
    };

    const purchase = (resourceId: string) => {
        clearFlashes('store:resources');

        purchaseResource(resourceId)
            .then(() => {
                setOpen(false);
                setSelectedResource(null);
                addFlash({
                    type: 'success',
                    key: 'store:resources',
                    message: 'Resource has been added to your account.',
                });
            })
            .catch((error) => clearAndAddHttpError({ key: 'store:resources', error }));
    };

    const itemsPerPage = 3;
    const step = 360 / resources.length;
    const normalizedRotation = (((rotation / step) % resources.length) + resources.length) % resources.length;
    const startIndex = Math.round(normalizedRotation);
    const visibleResources: typeof resources = [];
    for (let i = 0; i < itemsPerPage; i++) {
        visibleResources.push(resources[(startIndex + i) % resources.length]);
    }

    const selectedResourceData = resources.find((r) => r.id === selectedResource);
    const resourceCost = selectedResourceData ? costs?.[selectedResourceData.id as keyof Costs] || 0 : 0;

    if (!costs) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock
            title={'Buy Resources'}
            description={'Buy more resources to add to your server.'}
            showFlashKey={'store:resources'}
        >
            <div className='flex justify-end mb-6'>
                <Link to={'/store/create'} className='block'>
                    <Button.Text>Create a Server</Button.Text>
                </Link>
            </div>

            <SpinnerOverlay size={'large'} visible={open} />
            <Dialog.Confirm
                open={open}
                onClose={() => setOpen(false)}
                title={'Confirm resource purchase'}
                confirm={'Continue'}
                onConfirmed={() => {
                    if (selectedResource) {
                        purchase(selectedResource);
                    }
                }}
            >
                Are you sure you want to purchase {selectedResource}? This will take the credits from your account and
                add the resource. This is not a reversible transaction.
            </Dialog.Confirm>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Left - Wheel Navigation */}
                <div className='lg:col-span-1 flex flex-col items-center justify-center'>
                    <div className='relative w-80 h-80 mb-8'>
                        {/* Circular Background */}
                        <div className='absolute inset-0 rounded-full bg-gray-800/40 border border-gray-700/50' />

                        {/* Animated Orbit */}
                        <div
                            className='absolute inset-0 rounded-full border-2 border-gray-700/30'
                            style={{ animationDuration: '20s' }}
                        />

                        {/* Resource Icons Around Circle */}
                        {resources.map((res, idx) => {
                            const angle = (idx / resources.length) * Math.PI * 2;
                            const radius = 120;
                            const x = Math.cos(angle - Math.PI / 2) * radius;
                            const y = Math.sin(angle - Math.PI / 2) * radius;
                            const ResourceIcon = res.icon;
                            const isVisible = visibleResources.includes(res);

                            return (
                                <button
                                    key={res.id}
                                    onClick={() => setSelectedResource(res.id)}
                                    className='absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer'
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${
                                            isVisible ? 1 : 0.7
                                        })`,
                                        opacity: isVisible ? 1 : 0.5,
                                    }}
                                >
                                    <div
                                        className={`w-full h-full rounded-full bg-gradient-to-br ${res.color} p-0.5 hover:scale-110 transition-transform`}
                                    >
                                        <div className='w-full h-full rounded-full bg-gray-900 flex items-center justify-center'>
                                            <ResourceIcon className='w-7 h-7 text-white' />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {/* Center Info */}
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                            <div className='text-center'>
                                <p className='text-gray-400 text-sm mb-1'>Total Resources</p>
                                <p className='text-3xl font-bold text-white'>{resources.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className='flex gap-4'>
                        <button
                            onClick={() => handleRotate('prev')}
                            className='px-6 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-white rounded font-medium transition-colors'
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => handleRotate('next')}
                            className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center gap-2'
                        >
                            Next <ChevronRight className='w-4 h-4' />
                        </button>
                    </div>
                </div>

                {/* Right - Resource Cards */}
                <div className='lg:col-span-2 space-y-4'>
                    {visibleResources.map((res) => {
                        const ResourceIcon = res.icon;
                        const isSelected = selectedResource === res.id;
                        const cost = costs?.[res.id as keyof Costs] || 0;

                        return (
                            <div
                                key={res.id}
                                onClick={() => setSelectedResource(res.id)}
                                className={`group p-6 rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                    isSelected
                                        ? 'bg-gray-700/40 border-blue-500/50'
                                        : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
                                }`}
                            >
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${res.color}`}>
                                            <ResourceIcon className='w-6 h-6 text-white' />
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-white'>{res.name}</h3>
                                            <p className='text-gray-400 text-sm'>
                                                {res.amount}
                                                {res.suffix}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-2xl font-bold text-white'>{cost}</p>
                                        <p className='text-gray-400 text-xs'>credits</p>
                                    </div>
                                </div>

                                <p className='text-gray-400 text-sm mb-4'>{res.description}</p>

                                {isSelected && (
                                    <div className='pt-4 border-t border-gray-700/50 flex gap-3 animate-in fade-in slide-in-from-bottom-2'>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setResource(res.id);
                                                setOpen(true);
                                            }}
                                            className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors'
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info Section */}
            <div className='mt-16 p-8 rounded-lg bg-gray-800/40 border border-gray-700/50'>
                <h2 className='text-2xl font-bold text-white mb-4'>How to use resources</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div>
                        <h3 className='text-lg font-semibold text-white mb-2'>Adding to an existing server</h3>
                        <p className='text-gray-400'>
                            If you have a server that is already deployed, you can add resources to it by going to the
                            'edit' tab.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold text-white mb-2'>Adding to a new server</h3>
                        <p className='text-gray-400'>
                            You can buy resources and add them to a new server in the server creation page, which you
                            can access via the store.
                        </p>
                    </div>
                </div>
            </div>
        </PageContentBlock>
    );
};
