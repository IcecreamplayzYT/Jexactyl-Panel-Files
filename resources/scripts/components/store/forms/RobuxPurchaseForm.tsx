import tw from 'twin.macro';
import React, { useState, useEffect } from 'react';
import useFlash from '@/plugins/useFlash';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Input from '@/components/elements/Input';
import {
    getRobloxProfile,
    getRobloxProducts,
    initiateRobloxPurchase,
    checkRobloxPayment,
    cancelRobloxPurchase,
    RobloxProfile,
    RobloxProduct,
} from '@/api/store/robux';

type Step = 'username' | 'confirm-profile' | 'select-package' | 'pending';

export default () => {
    const { clearFlashes, clearAndAddHttpError, addFlash } = useFlash();
    const [step, setStep] = useState<Step>('username');
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState<RobloxProfile | null>(null);
    const [products, setProducts] = useState<RobloxProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<RobloxProduct | null>(null);
    const [purchaseId, setPurchaseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds

    useEffect(() => {
        // Load products on mount
        getRobloxProducts()
            .then(setProducts)
            .catch((error) => {
                console.error('Failed to load products:', error);
                clearAndAddHttpError({ key: 'store:robux', error });
            });
    }, []);

    const fetchProfile = async () => {
        if (!username.trim()) {
            clearAndAddHttpError({ key: 'store:robux', error: 'Please enter a Roblox username' });
            return;
        }

        setLoading(true);
        clearFlashes('store:robux');

        try {
            const profileData = await getRobloxProfile(username);
            setProfile(profileData);
            setStep('confirm-profile');
        } catch (error: any) {
            clearAndAddHttpError({ key: 'store:robux', error });
        } finally {
            setLoading(false);
        }
    };

    const confirmProfile = () => {
        setStep('select-package');
    };

    const selectPackage = async (product: RobloxProduct) => {
        if (!profile) return;

        setLoading(true);
        clearFlashes('store:robux');
        setSelectedProduct(product);

        try {
            const response = await initiateRobloxPurchase(profile.id, profile.username, product.id);
            setPurchaseId(response.purchase_id);
            setStep('pending');

            if (response.message) {
                addFlash({ key: 'store:robux', type: 'info', message: response.message });
            }
        } catch (error: any) {
            clearAndAddHttpError({ key: 'store:robux', error });
        } finally {
            setLoading(false);
        }
    };

    const checkPayment = async () => {
        if (!purchaseId) return;

        setChecking(true);
        clearFlashes('store:robux');

        try {
            const response = await checkRobloxPayment(purchaseId);

            if (response.success) {
                addFlash({
                    key: 'store:robux',
                    type: 'success',
                    message: `${response.message} You received ${response.credits_added} credits!`,
                });
                // Reload page to show updated balance
                setTimeout(() => window.location.reload(), 2000);
            } else {
                clearAndAddHttpError({ key: 'store:robux', error: response.message });
            }
        } catch (error: any) {
            clearAndAddHttpError({ key: 'store:robux', error });
        } finally {
            setChecking(false);
        }
    };

    // Auto-check payment every 10 seconds when in pending state
    useEffect(() => {
        if (step !== 'pending' || !purchaseId) return;

        // Reset timer when entering pending state
        setTimeRemaining(900);

        const interval = setInterval(async () => {
            try {
                const response = await checkRobloxPayment(purchaseId);
                if (response.success) {
                    clearInterval(interval);
                    addFlash({
                        key: 'store:robux',
                        type: 'success',
                        message: `${response.message} You received ${response.credits_added} credits!`,
                    });
                    setTimeout(() => window.location.reload(), 2000);
                }
            } catch (error) {
                // Silently continue checking
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [step, purchaseId]);

    // Countdown timer
    useEffect(() => {
        if (step !== 'pending') return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    addFlash({
                        key: 'store:robux',
                        type: 'danger',
                        message: 'Purchase verification timed out. Please contact support if you completed the purchase.',
                    });
                    resetForm();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [step]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const cancelPurchase = async () => {
        if (!purchaseId) return;

        try {
            await cancelRobloxPurchase(purchaseId);
            resetForm();
            addFlash({ key: 'store:robux', type: 'info', message: 'Purchase cancelled' });
        } catch (error: any) {
            clearAndAddHttpError({ key: 'store:robux', error });
        }
    };

    const resetForm = () => {
        setStep('username');
        setUsername('');
        setProfile(null);
        setSelectedProduct(null);
        setPurchaseId(null);
        clearFlashes('store:robux');
    };

    // Step 1: Enter Username
    if (step === 'username') {
        return (
            <TitledGreyBox title={'Purchase via Robux'}>
                <FlashMessageRender byKey={'store:robux'} css={tw`mb-4`} />
                <SpinnerOverlay visible={loading} />

                <div css={tw`mb-4`}>
                    <label css={tw`block text-sm font-medium mb-2 text-gray-300`}>Roblox Username</label>
                    <Input
                        type="text"
                        placeholder="Enter your Roblox username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchProfile()}
                        disabled={loading}
                    />
                    <p css={tw`text-xs text-gray-400 mt-1`}>
                        We'll verify your profile to ensure the correct account receives credits
                    </p>
                </div>

                <Button onClick={fetchProfile} disabled={loading || !username.trim()}>
                    Continue
                </Button>
            </TitledGreyBox>
        );
    }

    // Step 2: Confirm Profile
    if (step === 'confirm-profile' && profile) {
        return (
            <TitledGreyBox title={'Confirm Your Profile'}>
                <FlashMessageRender byKey={'store:robux'} css={tw`mb-4`} />

                <div css={tw`flex items-start gap-4 mb-6 bg-neutral-700 rounded-lg p-4`}>
                    <img
                        src={profile.thumbnail}
                        alt={profile.username}
                        css={tw`w-20 h-20 rounded-lg`}
                    />
                    <div css={tw`flex-1`}>
                        <h3 css={tw`text-lg font-semibold text-white`}>{profile.username}</h3>
                        <p css={tw`text-sm text-gray-400`}>@{profile.displayName}</p>
                        <p css={tw`text-xs text-gray-500 mt-2 line-clamp-2`}>
                            {profile.description || 'No description'}
                        </p>
                    </div>
                </div>

                <p css={tw`text-sm text-gray-300 mb-4`}>Is this your Roblox account?</p>

                <div css={tw`flex gap-2`}>
                    <Button onClick={confirmProfile} css={tw`flex-1`}>
                        Yes, Continue
                    </Button>
                    <Button onClick={resetForm} css={tw`bg-gray-600 hover:bg-gray-700`}>
                        No, Go Back
                    </Button>
                </div>
            </TitledGreyBox>
        );
    }

    // Step 3: Select Package
    if (step === 'select-package') {
        return (
            <TitledGreyBox title={'Select Credit Package'}>
                <FlashMessageRender byKey={'store:robux'} css={tw`mb-4`} />
                <SpinnerOverlay visible={loading} />

                <div css={tw`space-y-3 mb-4`}>
                    {products
                        .sort((a, b) => b.credits - a.credits)
                        .map((product) => (
                            <button
                                key={product.id}
                                onClick={() => selectPackage(product)}
                                disabled={loading}
                                css={tw`w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg p-4 text-left transition-colors border-2 border-transparent hover:border-blue-500`}
                            >
                                <div css={tw`flex justify-between items-center`}>
                                    <div>
                                        <h4 css={tw`text-lg font-semibold text-white`}>
                                            {product.credits} Credits
                                        </h4>
                                        <p css={tw`text-sm text-gray-400`}>{product.price} Robux</p>
                                    </div>
                                    <div css={tw`text-blue-400 font-medium`}>Select →</div>
                                </div>
                            </button>
                        ))}
                </div>

                <Button onClick={resetForm} css={tw`bg-gray-600 hover:bg-gray-700 w-full`}>
                    Cancel
                </Button>
            </TitledGreyBox>
        );
    }

    // Step 4: Pending Purchase
    if (step === 'pending' && selectedProduct && profile) {
        return (
            <TitledGreyBox title={'Complete Your Purchase'}>
                <FlashMessageRender byKey={'store:robux'} css={tw`mb-4`} />

                <div css={tw`bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4 mb-4`}>
                    <div css={tw`flex justify-between items-start mb-2`}>
                        <h3 css={tw`text-blue-400 font-bold`}>Purchase Pending</h3>
                        <div css={tw`text-right`}>
                            <div css={tw`text-blue-400 font-mono text-lg`}>{formatTime(timeRemaining)}</div>
                            <div css={tw`text-xs text-blue-300`}>Time remaining</div>
                        </div>
                    </div>
                    <p css={tw`text-sm text-gray-300 mb-2`}>
                        Purchasing <span css={tw`font-bold text-white`}>{selectedProduct.credits} credits</span> for{' '}
                        <span css={tw`font-bold text-white`}>{selectedProduct.price} Robux</span>
                    </p>
                    <p css={tw`text-xs text-gray-400`}>Account: {profile.username}</p>
                    <div css={tw`mt-3 flex items-center gap-2 text-xs text-green-400`}>
                        <div css={tw`animate-pulse`}>●</div>
                        <span>Auto-checking every 10 seconds...</span>
                    </div>
                </div>

                <div css={tw`bg-neutral-700 rounded-lg p-4 mb-4`}>
                    <h4 css={tw`font-semibold text-white mb-3`}>Follow these steps:</h4>
                    <ol css={tw`text-sm text-gray-300 space-y-2 pl-1`}>
                        <li css={tw`flex items-start gap-2`}>
                            <span css={tw`text-blue-400 font-bold`}>1.</span>
                            <span>Click "Open Gamepass" button below</span>
                        </li>
                        <li css={tw`flex items-start gap-2`}>
                            <span css={tw`text-blue-400 font-bold`}>2.</span>
                            <span>Purchase the gamepass on Roblox (take your time!)</span>
                        </li>
                        <li css={tw`flex items-start gap-2`}>
                            <span css={tw`text-blue-400 font-bold`}>3.</span>
                            <span>Your credits will be added automatically</span>
                        </li>
                    </ol>

                    <div css={tw`mt-4 p-3 bg-green-500 bg-opacity-10 border border-green-500 rounded`}>
                        <p css={tw`text-xs text-green-300`}>
                            ✓ You can switch tabs or apps - we'll keep checking for up to 15 minutes!
                        </p>
                    </div>

                    <div css={tw`mt-3 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded`}>
                        <p css={tw`text-xs text-yellow-300`}>
                            ⚠️ If you already own this gamepass, remove it from your inventory first by clicking the 3
                            dots and selecting "Remove from Inventory"
                        </p>
                    </div>
                </div>

                <a
                    href={selectedProduct.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    css={tw`block w-full bg-green-600 hover:bg-green-700 text-white text-center font-medium py-3 px-4 rounded-lg mb-3 transition-colors`}
                >
                    Open Gamepass on Roblox →
                </a>

                <div css={tw`flex gap-2`}>
                    <Button onClick={checkPayment} disabled={checking} css={tw`flex-1 bg-gray-600 hover:bg-gray-700`}>
                        {checking ? 'Checking...' : 'Check Now (Optional)'}
                    </Button>
                    <Button onClick={cancelPurchase} css={tw`bg-red-600 hover:bg-red-700`}>
                        Cancel
                    </Button>
                </div>
            </TitledGreyBox>
        );
    }

    return null;
};