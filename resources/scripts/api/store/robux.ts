import http from '@/api/http';

export interface RobloxProfile {
    id: number;
    username: string;
    displayName: string;
    description: string;
    thumbnail: string;
}

export interface RobloxProduct {
    id: number;
    credits: number;
    price: number;
    product_url: string;
}

export interface PurchaseResponse {
    purchase_id: number;
    product_url: string;
    credits: number;
    robux: number;
    message?: string;
}

export interface CheckPurchaseResponse {
    success: boolean;
    message: string;
    credits_added?: number;
}

/**
 * Get Roblox user profile by username
 */
export const getRobloxProfile = async (username: string): Promise<RobloxProfile> => {
    const { data } = await http.post('/api/client/store/robux/profile', { username });
    return data;
};

/**
 * Get available Robux products (gamepasses)
 */
export const getRobloxProducts = async (): Promise<RobloxProduct[]> => {
    const { data } = await http.get('/api/client/store/robux/products');
    return data;
};

/**
 * Initiate a Robux purchase
 */
export const initiateRobloxPurchase = async (
    robloxUserId: number,
    robloxUsername: string,
    gamepassId: number
): Promise<PurchaseResponse> => {
    const { data } = await http.post('/api/client/store/robux/purchase', {
        roblox_user_id: robloxUserId,
        roblox_username: robloxUsername,
        gamepass_id: gamepassId,
    });
    return data;
};

/**
 * Check if a purchase has been completed
 */
export const checkRobloxPayment = async (purchaseId: number): Promise<CheckPurchaseResponse> => {
    const { data } = await http.post('/api/client/store/robux/check', {
        purchase_id: purchaseId,
    });
    return data;
};

/**
 * Cancel a pending purchase
 */
export const cancelRobloxPurchase = async (purchaseId: number): Promise<void> => {
    await http.post('/api/client/store/robux/cancel', {
        purchase_id: purchaseId,
    });
};