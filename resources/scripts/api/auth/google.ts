import http from '@/api/http';

/**
 * Initiates Google OAuth flow
 * Returns the redirect URL to Google's OAuth consent screen
 */
export default (): Promise<string> => {
    return new Promise((resolve, reject) => {
        http.get('/auth/google')
            .then(({ data }) => resolve(data || '/auth/google'))
            .catch(reject);
    });
};