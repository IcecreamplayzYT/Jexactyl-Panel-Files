import tw from 'twin.macro';
import { Form, Formik, Field } from 'formik';
import React, { useState, useEffect } from 'react';
import useFlash from '@/plugins/useFlash';
import Select from '@/components/elements/Select';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Input from '@/components/elements/Input';
import { getRobloxProducts, initiateRobloxPurchase, checkRobloxPayment, RobloxProduct } from '@/api/store/robux';

export default () => {
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [amount, setAmount] = useState(0);
    const [robloxUserId, setRobloxUserId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [gamepasses, setGamepasses] = useState<RobloxProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseStep, setPurchaseStep] = useState<'form' | 'pending'>('form');
    const [gamepassUrl, setGamepassUrl] = useState('');
    const [selectedProductId, setSelectedProductId] = useState<number>(0);

    useEffect(() => {
        // Fetch real products from API
        getRobloxProducts()
            .then((products) => {
                setGamepasses(products);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to load Roblox products:', error);
                clearAndAddHttpError({ key: 'store:robux', error });
                setLoading(false);
            });
    }, []);

    const submit = () => {
        if (!robloxUserId) {
            clearAndAddHttpError({ key: 'store:robux', error: 'Please enter your Roblox User ID' });
            return;
        }

        if (!amount) {
            clearAndAddHttpError({ key: 'store:robux', error: 'Please select an amount' });
            return;
        }

        setSubmitting(true);
        clearFlashes('store:robux');

        const selectedGamepass = gamepasses.find((gp) => gp.credits === amount);
        if (!selectedGamepass) {
            setSubmitting(false);
            clearAndAddHttpError({ key: 'store:robux', error: 'Invalid gamepass selected' });
            return;
        }

        // Call API to initiate purchase
        initiateRobloxPurchase(robloxUserId, selectedGamepass.id)
            .then((response) => {
                setGamepassUrl(response.product_url);
                setSelectedProductId(selectedGamepass.id);
                setPurchaseStep('pending');
                setSubmitting(false);
            })
            .catch((error) => {
                setSubmitting(false);
                clearAndAddHttpError({ key: 'store:robux', error });
            });
    };

    const checkPayment = () => {
        setSubmitting(true);
        clearFlashes('store:robux');

        checkRobloxPayment(robloxUserId, selectedProductId)
            .then((response) => {
                setSubmitting(false);
                if (response.success) {
                    // Payment verified! Reset form
                    setPurchaseStep('form');
                    setAmount(0);
                    setRobloxUserId('');
                    clearFlashes('store:robux');
                    // TODO: Show success message and refresh balance
                } else {
                    clearAndAddHttpError({
                        key: 'store:robux',
                        error: response.message || 'Payment not detected yet. Please try again after purchase.',
                    });
                }
            })
            .catch((error) => {
                setSubmitting(false);
                clearAndAddHttpError({ key: 'store:robux', error });
            });
    };

    const cancelPurchase = () => {
        setPurchaseStep('form');
        setGamepassUrl('');
        setAmount(0);
        clearFlashes('store:robux');
    };

    if (purchaseStep === 'pending') {
        return (
            <TitledGreyBox title={'Purchase via Robux'}>
                <FlashMessageRender byKey={'store:robux'} css={tw`mb-4`} />
                <div css={tw`bg-blue-500 bg-opacity-10 border border-blue-500 rounded p-4 mb-4`}>
                    <h3 css={tw`text-blue-400 font-bold mb-2 flex items-center`}>
                        Purchase Pending
                    </h3>
                    <p css={tw`text-sm text-gray-300 mb-3`}>
                        Waiting for purchase of <span css={tw`font-bold text-white`}>{amount} credits</span>
                    </p>
                    <ol css={tw`text-sm text-gray-300 space-y-2 mb-4 pl-4`}>
                        <li>1. Click "Open Gamepass" below</li>
                        <li>2. Purchase the gamepass on Roblox</li>
                        <li>3. Return here and click "Check Payment"</li>
                    </ol>
                    <a
                        href={gamepassUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        css={tw`block w-full bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded mb-3 transition-colors`}
                    >
                        Open Gamepass on Roblox →
                    </a>
                </div>

                <div css={tw`flex gap-2`}>
                    <Button type="button" onClick={checkPayment} disabled={submitting} css={tw`flex-1`}>
                        {submitting ? 'Checking...' : 'Check Payment Status'}
                    </Button>
                    <Button type="button" onClick={cancelPurchase} disabled={submitting} css={tw`bg-gray-600`}>
                        Cancel
                    </Button>
                </div>
            </TitledGreyBox>
        );
    }

    return (
        <TitledGreyBox title={'Purchase via Robux'}>
            <Dialog open={submitting} hideCloseIcon onClose={() => undefined}>
                Preparing your Robux purchase...
            </Dialog>
            <FlashMessageRender byKey={'store:robux'} css={tw`mb-2`} />
            <Formik onSubmit={submit} initialValues={{ amount: 0, robloxUserId: '' }}>
                <Form>
                    <SpinnerOverlay size={'large'} visible={submitting || loading} />

                    <div css={tw`mb-4`}>
                        <label css={tw`block text-sm font-medium mb-2`}>Roblox User ID</label>
                        <Input
                            type="text"
                            placeholder="123456789"
                            value={robloxUserId}
                            onChange={(e) => setRobloxUserId(e.target.value)}
                            disabled={submitting || loading}
                        />
                        <p css={tw`text-xs text-gray-400 mt-1`}>
                            Find your User ID at{' '}
                            <a
                                href="https://www.roblox.com/users/profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                css={tw`text-blue-400 hover:underline`}
                            >
                                roblox.com/users/profile
                            </a>{' '}
                            (it's in the URL)
                        </p>
                    </div>

                    <Select
                        name={'amount'}
                        disabled={submitting || loading}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    >
                        <option key={'robux:placeholder'} value={0} hidden>
                            Choose an amount...
                        </option>
                        {gamepasses.map((gp) => (
                            <option key={`robux:buy:${gp.credits}`} value={gp.credits}>
                                Purchase {gp.credits} credits ({gp.price} Robux)
                            </option>
                        ))}
                    </Select>

                    {amount > 0 && robloxUserId && (
                        <div css={tw`mt-3 bg-neutral-700 rounded p-3 text-sm`}>
                            <p css={tw`text-gray-300`}>
                                You will receive: <span css={tw`text-white font-bold`}>{amount} credits</span>
                            </p>
                            <p css={tw`text-gray-300`}>
                                Cost:{' '}
                                <span css={tw`text-white font-bold`}>
                                    {gamepasses.find((gp) => gp.credits === amount)?.price || 0} Robux
                                </span>
                            </p>
                        </div>
                    )}

                    <div css={tw`mt-6`}>
                        <Button type={'submit'} disabled={submitting || loading || !amount || !robloxUserId}>
                            Continue to Roblox Payment
                        </Button>
                    </div>
                </Form>
            </Formik>
        </TitledGreyBox>
    );
};