import http from '@/api/http';

export interface RobloxProduct {
    id: number;
    name: string;
    credits: number;
    price: number;
}

export const getRobloxProducts = (): Promise<RobloxProduct[]> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/store/robux/products')
            .then(({ data }) => resolve(data.products || []))
            .catch(reject);
    });
};

export const initiateRobloxPurchase = (robloxUserId: string, productId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/store/robux/initiate', {
            roblox_user_id: parseInt(robloxUserId),
            product_id: productId,
        })
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

export const checkRobloxPayment = (robloxUserId: string, productId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/store/robux/check', {
            roblox_user_id: parseInt(robloxUserId),
            product_id: productId,
        })
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};