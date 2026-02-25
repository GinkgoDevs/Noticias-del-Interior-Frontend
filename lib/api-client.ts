export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/v1';

interface FetchOptions extends RequestInit {
    revalidate?: number | false;
    tags?: string[];
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
    let token: string | undefined;

    const { revalidate, tags, ...restOptions } = options;

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
        // Server side: get from next/headers
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            token = cookieStore.get('token')?.value;
            if (token === 'undefined') token = undefined;
        } catch (error: any) {
            // Suppress "Dynamic server usage" logs during build as it's normal Next.js behavior
            if (!error.message?.includes('Dynamic server usage')) {
                console.error('Error accessing cookies on server:', error);
            }
        }
    }

    const url = `${API_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Next.js specific fetching options
    const nextOptions: any = {};
    if (revalidate !== undefined) nextOptions.revalidate = revalidate;
    if (tags !== undefined) nextOptions.tags = tags;

    try {
        const response = await fetch(url, {
            ...restOptions,
            headers,
            ...(Object.keys(nextOptions).length > 0 ? { next: nextOptions } : {}),
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
