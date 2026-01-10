export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    let token: string | undefined;

    if (typeof window !== 'undefined') {
        // Client side: get from cookie or localStorage
        token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token || token === 'undefined') {
            token = localStorage.getItem('token') || undefined;
        }

        if (token === 'undefined') token = undefined;
    } else {
        // Server side: get from next/headers using dynamic import to avoid client-side bundle errors
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            token = cookieStore.get('token')?.value;
            if (token === 'undefined') token = undefined;
        } catch (error) {
            // If we are somehow here on the client (shouldn't happen with typeof window check)
            // or if cookies() is called outside of a request context
            console.error('Error accessing cookies on server:', error);
        }
    }

    const url = `${API_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Ocurrió un error en la petición';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error: any) {
        throw error;
    }
}
