// import * as Icon from 'react-feather';
// import { Form, Formik } from 'formik';
// import useFlash from '@/plugins/useFlash';
// import { useStoreState } from 'easy-peasy';
// import { number, object, string } from 'yup';
// import Field from '@/components/elements/Field';
// import Select from '@/components/elements/Select';
// import { Egg, getEggs } from '@/api/store/getEggs';
// import createServer from '@/api/store/createServer';
// import Spinner from '@/components/elements/Spinner';
// import { getNodes, Node } from '@/api/store/getNodes';
// import { getNests, Nest } from '@/api/store/getNests';
// import { Button } from '@/components/elements/button';
// import InputSpinner from '@/components/elements/InputSpinner';
// import StoreError from '@/components/elements/store/StoreError';
// import React, { ChangeEvent, useEffect, useState } from 'react';
// import TitledGreyBox from '@/components/elements/TitledGreyBox';
// import FlashMessageRender from '@/components/FlashMessageRender';
// import StoreContainer from '@/components/elements/StoreContainer';
// import { getResources, Resources } from '@/api/store/getResources';
// import PageContentBlock from '@/components/elements/PageContentBlock';
// import {
//     faArchive,
//     faCube,
//     faDatabase,
//     faEgg,
//     faHdd,
//     faLayerGroup,
//     faList,
//     faMemory,
//     faMicrochip,
//     faNetworkWired,
//     faStickyNote,
// } from '@fortawesome/free-solid-svg-icons';

// interface CreateValues {
//     name: string;
//     description: string | null;
//     cpu: number;
//     memory: number;
//     disk: number;
//     ports: number;
//     backups: number | null;
//     databases: number | null;

//     egg: number;
//     nest: number;
//     node: number;
// }

// export default () => {
//     const [loading, setLoading] = useState(false);
//     const [resources, setResources] = useState<Resources>();

//     const user = useStoreState((state) => state.user.data!);
//     const { clearFlashes, clearAndAddHttpError } = useFlash();

//     const [egg, setEgg] = useState<number>(0);
//     const [eggs, setEggs] = useState<Egg[]>();
//     const [nest, setNest] = useState<number>(0);
//     const [nests, setNests] = useState<Nest[]>();
//     const [node, setNode] = useState<number>(0);
//     const [nodes, setNodes] = useState<Node[]>();

//     useEffect(() => {
//         clearFlashes();

//         getResources().then((resources) => setResources(resources));

//         getEggs().then((eggs) => setEggs(eggs));
//         getNests().then((nests) => setNests(nests));
//         getNodes().then((nodes) => setNodes(nodes));
//     }, []);

//     const changeNest = (e: ChangeEvent<HTMLSelectElement>) => {
//         setNest(parseInt(e.target.value));

//         getEggs(parseInt(e.target.value)).then((eggs) => {
//             setEggs(eggs);
//             setEgg(eggs[0].id);
//         });
//     };

//     const submit = (values: CreateValues) => {
//         setLoading(true);
//         clearFlashes('store:create');

//         createServer(values, egg, nest, node)
//             .then((data) => {
//                 if (!data.id) return;

//                 setLoading(false);
//                 clearFlashes('store:create');
//                 // @ts-expect-error this is valid
//                 window.location = `/server/${data.id}`;
//             })
//             .catch((error) => {
//                 setLoading(false);
//                 clearAndAddHttpError({ key: 'store:create', error });
//             });
//     };

//     if (!resources) return <Spinner size={'large'} centered />;

//     if (!nodes) {
//         return (
//             <StoreError
//                 message={'No nodes are available for deployment. Try again later.'}
//                 admin={'Ensure you have at least one node that can be deployed to.'}
//             />
//         );
//     }

//     if (!nests || !eggs) {
//         return (
//             <StoreError
//                 message={'No server types are available for deployment. Try again later.'}
//                 admin={'Ensure you have at least one egg which is in a public nest.'}
//             />
//         );
//     }

//     return (
//         <PageContentBlock title={'Create Server'} showFlashKey={'store:create'}>
//             <Formik
//                 onSubmit={submit}
//                 initialValues={{
//                     name: `${user.username}'s server`,
//                     description: 'Write a server description here.',
//                     cpu: resources.cpu,
//                     memory: resources.memory,
//                     disk: resources.disk,
//                     ports: resources.ports,
//                     backups: resources.backups,
//                     databases: resources.databases,
//                     nest: 1,
//                     egg: 1,
//                     node: 1,
//                 }}
//                 validationSchema={object().shape({
//                     name: string().required().min(3),
//                     description: string().optional().min(3).max(191),

//                     cpu: number().required().min(25).max(resources.cpu),
//                     memory: number().required().min(256).max(resources.memory),
//                     disk: number().required().min(256).max(resources.disk),

//                     ports: number().required().min(1).max(resources.ports),
//                     backups: number().optional().max(resources.backups),
//                     databases: number().optional().max(resources.databases),

//                     node: number().required().default(node),
//                     nest: number().required().default(nest),
//                     egg: number().required().default(egg),
//                 })}
//             >
//                 <Form>
//                     <h1 className={'text-5xl'}>Basic Details</h1>
//                     <h3 className={'text-2xl text-neutral-500'}>Set the basic fields for your new server.</h3>
//                     <StoreContainer className={'lg:grid lg:grid-cols-2 my-10 gap-4'}>
//                         <TitledGreyBox title={'Server name'} icon={faStickyNote} className={'mt-8 sm:mt-0'}>
//                             <Field name={'name'} />
//                             <p className={'mt-1 text-xs'}>Assign a name to your server for use in the Panel.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>
//                                 Character limits: <code>a-z A-Z 0-9 _ - .</code> and <code>[Space]</code>.
//                             </p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server description'} icon={faList} className={'mt-8 sm:mt-0'}>
//                             <Field name={'description'} />
//                             <p className={'mt-1 text-xs'}>Set a description for your server.</p>
//                             <p className={'mt-1 text-xs text-yellow-400'}>* Optional</p>
//                         </TitledGreyBox>
//                     </StoreContainer>
//                     <h1 className={'text-5xl'}>Resource Limits</h1>
//                     <h3 className={'text-2xl text-neutral-500'}>Set specific limits for CPU, RAM and more.</h3>
//                     <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
//                         <TitledGreyBox title={'Server CPU limit'} icon={faMicrochip} className={'mt-8 sm:mt-0'}>
//                             <Field name={'cpu'} />
//                             <p className={'mt-1 text-xs'}>Assign a limit for usable CPU.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>{resources.cpu}% in account</p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server RAM limit'} icon={faMemory} className={'mt-8 sm:mt-0'}>
//                             <div className={'relative'}>
//                                 <Field name={'memory'} />
//                                 <p className={'absolute text-sm top-1.5 right-2 bg-gray-700 p-2 rounded-lg'}>MB</p>
//                             </div>
//                             <p className={'mt-1 text-xs'}>Assign a limit for usable RAM.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>{resources.memory}MB available</p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server Storage limit'} icon={faHdd} className={'mt-8 sm:mt-0'}>
//                             <div className={'relative'}>
//                                 <Field name={'disk'} />
//                                 <p className={'absolute text-sm top-1.5 right-2 bg-gray-700 p-2 rounded-lg'}>MB</p>
//                             </div>
//                             <p className={'mt-1 text-xs'}>Assign a limit for usable storage.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>{resources.disk}MB available</p>
//                         </TitledGreyBox>
//                     </StoreContainer>
//                     <h1 className={'text-5xl'}>Feature Limits</h1>
//                     <h3 className={'text-2xl text-neutral-500'}>
//                         Add databases, allocations and ports to your server.
//                     </h3>
//                     <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
//                         <TitledGreyBox title={'Server allocations'} icon={faNetworkWired} className={'mt-8 sm:mt-0'}>
//                             <Field name={'ports'} />
//                             <p className={'mt-1 text-xs'}>Assign a number of ports to your server.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>{resources.ports} available</p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server backups'} icon={faArchive} className={'mt-8 sm:mt-0'}>
//                             <Field name={'backups'} />
//                             <p className={'mt-1 text-xs'}>Assign a number of backups to your server.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>{resources.backups} available</p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server databases'} icon={faDatabase} className={'mt-8 sm:mt-0'}>
//                             <Field name={'databases'} />
//                             <p className={'mt-1 text-xs'}>Assign a number of databases to your server.</p>
//                             <p className={'mt-1 text-xs text-gray-400'}>{resources.databases} available</p>
//                         </TitledGreyBox>
//                     </StoreContainer>
//                     <h1 className={'text-5xl'}>Deployment</h1>
//                     <h3 className={'text-2xl text-neutral-500'}>Choose a node and server type.</h3>
//                     <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
//                         <TitledGreyBox title={'Available Nodes'} icon={faLayerGroup} className={'mt-8 sm:mt-0'}>
//                             <Select name={'node'} onChange={(e) => setNode(parseInt(e.target.value))}>
//                                 {!node && <option>Select a node...</option>}
//                                 {nodes.map((n) => (
//                                     <option key={n.id} value={n.id}>
//                                         {n.name} ({n.location}) |{' '}
//                                         {100 - parseInt(((n?.used / n?.total) * 100).toFixed(0))}% free | {n.deployFee}{' '}
//                                         credits
//                                     </option>
//                                 ))}
//                             </Select>
//                             <p className={'mt-1 text-xs text-gray-400'}>Select a node to deploy your server to.</p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server Nest'} icon={faCube} className={'mt-8 sm:mt-0'}>
//                             <Select name={'nest'} onChange={(nest) => changeNest(nest)}>
//                                 {!nest && <option>Select a nest...</option>}
//                                 {nests.map((n) => (
//                                     <option key={n.id} value={n.id}>
//                                         {n.name}
//                                     </option>
//                                 ))}
//                             </Select>
//                             <p className={'mt-1 text-xs text-gray-400'}>Select a nest to use for your server.</p>
//                         </TitledGreyBox>
//                         <TitledGreyBox title={'Server Egg'} icon={faEgg} className={'mt-8 sm:mt-0'}>
//                             <Select name={'egg'} onChange={(e) => setEgg(parseInt(e.target.value))}>
//                                 {!egg && <option>Select an egg...</option>}
//                                 {eggs.map((e) => (
//                                     <option key={e.id} value={e.id}>
//                                         {e.name}
//                                     </option>
//                                 ))}
//                             </Select>
//                             <p className={'mt-1 text-xs text-gray-400'}>
//                                 Choose what game you want to run on your server.
//                             </p>
//                         </TitledGreyBox>
//                     </StoreContainer>
//                     <InputSpinner visible={loading}>
//                         <FlashMessageRender byKey={'store:create'} className={'my-2'} />
//                         <div className={'text-right'}>
//                             <Button
//                                 type={'submit'}
//                                 className={'w-1/6 mb-4'}
//                                 size={Button.Sizes.Large}
//                                 disabled={loading}
//                             >
//                                 <Icon.Server className={'mr-2'} /> Create
//                             </Button>
//                         </div>
//                     </InputSpinner>
//                 </Form>
//             </Formik>
//         </PageContentBlock>
//     );
// };

import * as Icon from 'react-feather';
import { Form, Formik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { number, object, string } from 'yup';
import Field from '@/components/elements/Field';
import Select from '@/components/elements/Select';
import { Egg, getEggs } from '@/api/store/getEggs';
import createServer from '@/api/store/createServer';
import Spinner from '@/components/elements/Spinner';
import { getNodes, Node } from '@/api/store/getNodes';
import { getNests, Nest } from '@/api/store/getNests';
import InputSpinner from '@/components/elements/InputSpinner';
import StoreError from '@/components/elements/store/StoreError';
import React, { ChangeEvent, useEffect, useState } from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { Check, AlertCircle } from 'lucide-react';

interface CreateValues {
    name: string;
    description: string | null;
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number | null;
    databases: number | null;
    egg: number;
    nest: number;
    node: number;
}

export default () => {
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState<Resources>();
    const [currentStep, setCurrentStep] = useState(1);

    const user = useStoreState((state) => state.user.data!);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const [egg, setEgg] = useState<number>(0);
    const [eggs, setEggs] = useState<Egg[]>();
    const [nest, setNest] = useState<number>(0);
    const [nests, setNests] = useState<Nest[]>();
    const [node, setNode] = useState<number>(0);
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        clearFlashes();

        getResources().then((resources) => setResources(resources));
        getEggs().then((eggs) => setEggs(eggs));
        getNests().then((nests) => setNests(nests));
        getNodes().then((nodes) => setNodes(nodes));
    }, []);

    const changeNest = (e: ChangeEvent<HTMLSelectElement>) => {
        setNest(parseInt(e.target.value));

        getEggs(parseInt(e.target.value)).then((eggs) => {
            setEggs(eggs);
            setEgg(eggs[0].id);
        });
    };

    const submit = (values: CreateValues) => {
        setLoading(true);
        clearFlashes('store:create');

        createServer(values, egg, nest, node)
            .then((data) => {
                if (!data.id) return;

                setLoading(false);
                clearFlashes('store:create');
                // @ts-expect-error this is valid
                window.location = `/server/${data.id}`;
            })
            .catch((error) => {
                setLoading(false);
                clearAndAddHttpError({ key: 'store:create', error });
            });
    };

    const getStepErrors = (errors: any, stepNum: number) => {
        if (stepNum === 1) {
            return errors.name ? [errors.name] : [];
        }
        if (stepNum === 2) {
            return [errors.cpu, errors.memory, errors.disk].filter(Boolean);
        }
        if (stepNum === 3) {
            return [errors.ports, errors.backups, errors.databases].filter(Boolean);
        }
        if (stepNum === 4) {
            return [errors.node, errors.nest, errors.egg].filter(Boolean);
        }
        return [];
    };

    if (!resources) return <Spinner size={'large'} centered />;

    if (!nodes) {
        return (
            <StoreError
                message={'No nodes are available for deployment. Try again later.'}
                admin={'Ensure you have at least one node that can be deployed to.'}
            />
        );
    }

    if (!nests || !eggs) {
        return (
            <StoreError
                message={'No server types are available for deployment. Try again later.'}
                admin={'Ensure you have at least one egg which is in a public nest.'}
            />
        );
    }

    const steps = [
        { number: 1, title: 'Basic Details', subtitle: 'Name & description' },
        { number: 2, title: 'Resource Limits', subtitle: 'CPU, RAM, Storage' },
        { number: 3, title: 'Feature Limits', subtitle: 'Allocations & addons' },
        { number: 4, title: 'Deployment', subtitle: 'Node, Nest & Egg' },
        { number: 5, title: 'Review & Confirm', subtitle: 'Final check' },
    ];

    return (
        <PageContentBlock
            title={'Create Server'}
            description={'A simple step-by-step flow — clean & flat.'}
            showFlashKey={'store:create'}
        >
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                <div className='lg:col-span-1'>
                    <div className='bg-gray-800/60 border border-gray-700/50 rounded-lg p-6 sticky top-8'>
                        <div className='space-y-2'>
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className={`flex items-start space-x-4 p-4 rounded transition-all cursor-pointer ${
                                        currentStep === step.number
                                            ? 'bg-gray-700/40 border border-gray-600/50'
                                            : currentStep > step.number
                                            ? 'bg-gray-800/20'
                                            : 'bg-transparent'
                                    }`}
                                    onClick={() => setCurrentStep(step.number)}
                                >
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                            currentStep === step.number
                                                ? 'bg-blue-600 text-white'
                                                : currentStep > step.number
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                    >
                                        {currentStep > step.number ? <Check className='w-4 h-4' /> : step.number}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p
                                            className={`font-medium text-sm ${
                                                currentStep === step.number ? 'text-white' : 'text-gray-400'
                                            }`}
                                        >
                                            {step.title}
                                        </p>
                                        <p className='text-xs text-gray-500'>{step.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='lg:col-span-3'>
                    <Formik
                        onSubmit={submit}
                        initialValues={{
                            name: `${user.username}'s server`,
                            description: 'Write a server description here.',
                            cpu: 50,
                            memory: 256,
                            disk: 256,
                            ports: 1,
                            backups: 1,
                            databases: 1,
                            nest: 1,
                            egg: 1,
                            node: 1,
                        }}
                        validationSchema={object().shape({
                            name: string().required().min(3),
                            description: string().optional().min(3).max(191),
                            cpu: number().required().min(50).max(100),
                            memory: number().required().min(256).max(1024),
                            disk: number().required().min(256).max(1024),
                            ports: number().required().min(1),
                            backups: number().optional().min(1).max(5),
                            databases: number().optional().max(1),
                            node: number().required(),
                            nest: number().required(),
                            egg: number().required(),
                        })}
                    >
                        {({ values, errors }) => {
                            const currentStepErrors = getStepErrors(errors, currentStep);
                            const canProgress = currentStepErrors.length === 0;

                            const selectedNest = nests?.find((n) => n.id === nest);
                            const selectedEgg = eggs?.find((e) => e.id === egg);
                            const selectedNode = nodes?.find((n) => n.id === node);

                            return (
                                <Form>
                                    <div className='bg-gray-800/60 border border-gray-700/50 rounded-lg p-8'>
                                        <FlashMessageRender byKey={'store:create'} className={'mb-6'} />

                                        {currentStepErrors.length > 0 && (
                                            <div className='mb-6 bg-red-900/30 border border-red-700/50 rounded-lg p-4'>
                                                <div className='flex gap-3'>
                                                    <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0 mt-0.5' />
                                                    <div>
                                                        <h3 className='text-red-400 font-semibold mb-2'>
                                                            Please complete the following:
                                                        </h3>
                                                        <ul className='space-y-1'>
                                                            {currentStepErrors.map((error, idx) => (
                                                                <li key={idx} className='text-red-300 text-sm'>
                                                                    • {error}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 1 && (
                                            <div className='space-y-6'>
                                                <div>
                                                    <h2 className='text-2xl font-bold text-white mb-2'>
                                                        Basic Details
                                                    </h2>
                                                    <p className='text-gray-400 mb-8'>
                                                        Set the basic fields for your new server.
                                                    </p>
                                                </div>

                                                <div className='space-y-6'>
                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Name
                                                        </label>
                                                        <Field
                                                            name='name'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Assign a name to your server for use in the Panel.
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Description
                                                            <span className='text-yellow-500 ml-2'>* Optional</span>
                                                        </label>
                                                        <Field
                                                            name='description'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Set a description for your server.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 2 && (
                                            <div className='space-y-6'>
                                                <div>
                                                    <h2 className='text-2xl font-bold text-white mb-2'>
                                                        Resource Limits
                                                    </h2>
                                                    <p className='text-gray-400 mb-8'>
                                                        Set specific limits for CPU, RAM and Storage.
                                                    </p>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            CPU (%)
                                                        </label>
                                                        <Field
                                                            name='cpu'
                                                            type='number'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Min: 50% | Max: 100%
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            RAM (MB)
                                                        </label>
                                                        <Field
                                                            name='memory'
                                                            type='number'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Min: 256 MB | Max: 512 MB
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Storage (MB)
                                                        </label>
                                                        <Field
                                                            name='disk'
                                                            type='number'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Min: 256 MB | Max: 700 MBB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 3 && (
                                            <div className='space-y-6'>
                                                <div>
                                                    <h2 className='text-2xl font-bold text-white mb-2'>
                                                        Feature Limits
                                                    </h2>
                                                    <p className='text-gray-400 mb-8'>
                                                        Add databases, allocations and backups to your server.
                                                    </p>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Allocations
                                                        </label>
                                                        <Field
                                                            name='ports'
                                                            type='number'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>Min: 1 (no max)</p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Backups
                                                            <span className='text-yellow-500 ml-2'>* Optional</span>
                                                        </label>
                                                        <Field
                                                            name='backups'
                                                            type='number'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>Min: 1 | Max: 5</p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Databases
                                                            <span className='text-yellow-500 ml-2'>* Optional</span>
                                                        </label>
                                                        <Field
                                                            name='databases'
                                                            type='number'
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        />
                                                        <p className='mt-2 text-sm text-gray-500'>Max: 1</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 4 && (
                                            <div className='space-y-6'>
                                                <div>
                                                    <h2 className='text-2xl font-bold text-white mb-2'>
                                                        Select Deployment Settings
                                                    </h2>
                                                    <p className='text-gray-400 mb-8'>Choose a node and server type.</p>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Available Nodes
                                                        </label>
                                                        <Select
                                                            name='node'
                                                            onChange={(e) => setNode(parseInt(e.target.value))}
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        >
                                                            {!node && <option>Select a node...</option>}
                                                            {nodes.map((n) => (
                                                                <option key={n.id} value={n.id}>
                                                                    {n.name} ({n.location}) |{' '}
                                                                    {100 -
                                                                        parseInt(
                                                                            ((n?.used / n?.total) * 100).toFixed(0)
                                                                        )}
                                                                    % free | {n.deployFee} credits
                                                                </option>
                                                            ))}
                                                        </Select>
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Select a node to deploy your server to.
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Nest
                                                        </label>
                                                        <Select
                                                            name='nest'
                                                            onChange={(nest) => changeNest(nest)}
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        >
                                                            {!nest && <option>Select a nest...</option>}
                                                            {nests.map((n) => (
                                                                <option key={n.id} value={n.id}>
                                                                    {n.name}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Select a nest to use for your server.
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                            Server Egg
                                                        </label>
                                                        <Select
                                                            name='egg'
                                                            onChange={(e) => setEgg(parseInt(e.target.value))}
                                                            className='w-full bg-gray-900/50 border border-gray-700/50 rounded px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-colors'
                                                        >
                                                            {!egg && <option>Select an egg...</option>}
                                                            {eggs.map((e) => (
                                                                <option key={e.id} value={e.id}>
                                                                    {e.name}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                        <p className='mt-2 text-sm text-gray-500'>
                                                            Choose what game you want to run on your server.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 5 && (
                                            <div className='space-y-6'>
                                                <div>
                                                    <h2 className='text-2xl font-bold text-white mb-2'>
                                                        Review & Confirm
                                                    </h2>
                                                    <p className='text-gray-400 mb-8'>
                                                        Double-check everything before creating
                                                    </p>
                                                </div>

                                                <div className='space-y-4'>
                                                    <div className='bg-gray-900/30 border border-gray-700/50 rounded-lg p-4'>
                                                        <h3 className='text-sm font-semibold text-gray-300 mb-3'>
                                                            Basic Details
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>Server Name:</span>
                                                                <span className='text-white font-medium'>
                                                                    {values.name}
                                                                </span>
                                                            </div>
                                                            {values.description && (
                                                                <div className='flex justify-between'>
                                                                    <span className='text-gray-500'>Description:</span>
                                                                    <span className='text-white font-medium'>
                                                                        {values.description}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='bg-gray-900/30 border border-gray-700/50 rounded-lg p-4'>
                                                        <h3 className='text-sm font-semibold text-gray-300 mb-3'>
                                                            Resources
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>CPU:</span>
                                                                <span className='text-white font-medium'>
                                                                    {values.cpu}%
                                                                </span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>RAM:</span>
                                                                <span className='text-white font-medium'>
                                                                    {values.memory}MB
                                                                </span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>Disk:</span>
                                                                <span className='text-white font-medium'>
                                                                    {values.disk}MB
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='bg-gray-900/30 border border-gray-700/50 rounded-lg p-4'>
                                                        <h3 className='text-sm font-semibold text-gray-300 mb-3'>
                                                            Features
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>Allocations:</span>
                                                                <span className='text-white font-medium'>
                                                                    {values.ports}
                                                                </span>
                                                            </div>
                                                            {values.backups > 0 && (
                                                                <div className='flex justify-between'>
                                                                    <span className='text-gray-500'>Backups:</span>
                                                                    <span className='text-white font-medium'>
                                                                        {values.backups}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {values.databases > 0 && (
                                                                <div className='flex justify-between'>
                                                                    <span className='text-gray-500'>Databases:</span>
                                                                    <span className='text-white font-medium'>
                                                                        {values.databases}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='bg-gray-900/30 border border-gray-700/50 rounded-lg p-4'>
                                                        <h3 className='text-sm font-semibold text-gray-300 mb-3'>
                                                            Deployment
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>Node:</span>
                                                                <span className='text-white font-medium'>
                                                                    {selectedNode?.name || 'Not selected'}
                                                                </span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>Nest:</span>
                                                                <span className='text-white font-medium'>
                                                                    {selectedNest?.name || 'Not selected'}
                                                                </span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-gray-500'>Egg:</span>
                                                                <span className='text-white font-medium'>
                                                                    {selectedEgg?.name || 'Not selected'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className='flex items-center justify-between mt-8 pt-6 border-t border-gray-700/50'>
                                            <button
                                                type='button'
                                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                                disabled={currentStep === 1}
                                                className={`px-6 py-3 rounded font-medium transition-colors ${
                                                    currentStep === 1
                                                        ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
                                                        : 'bg-gray-700/50 text-white hover:bg-gray-700/70'
                                                }`}
                                            >
                                                Back
                                            </button>

                                            <div className='text-sm text-gray-400'>Step {currentStep} of 5</div>

                                            {currentStep < 5 ? (
                                                <button
                                                    type='button'
                                                    onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                                                    disabled={!canProgress}
                                                    className={`px-6 py-3 rounded font-medium transition-colors ${
                                                        canProgress
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                >
                                                    Continue
                                                </button>
                                            ) : (
                                                <InputSpinner visible={loading}>
                                                    <button
                                                        type='submit'
                                                        disabled={loading || !canProgress}
                                                        className={`px-6 py-3 rounded font-medium flex items-center space-x-2 transition-colors ${
                                                            canProgress && !loading
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                : 'bg-gray-700/40 text-gray-500 cursor-not-allowed opacity-50'
                                                        }`}
                                                    >
                                                        <Icon.Server className='w-5 h-5' />
                                                        <span>Create Server</span>
                                                    </button>
                                                </InputSpinner>
                                            )}
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </PageContentBlock>
    );
};
