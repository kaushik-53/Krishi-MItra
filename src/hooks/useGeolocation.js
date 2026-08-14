import { useState, useEffect } from 'react';
export function useGeolocation() {
    const [state, setState] = useState(() => {
        const supported = typeof window !== 'undefined' && !!navigator.geolocation;
        return {
            latitude: null,
            longitude: null,
            error: supported ? null : 'Geolocation not supported',
            isLoading: supported,
        };
    });
    useEffect(() => {
        if (!state.isLoading || state.error) return;
        navigator.geolocation.getCurrentPosition((position) => {
            setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                isLoading: false,
            });
        }, (error) => {
            setState((prev) => ({ ...prev, error: error.message, isLoading: false }));
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
    }, [state.isLoading, state.error]);
    return state;
}
