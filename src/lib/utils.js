import { clsx } from 'clsx';
export function cn(...inputs) {
    return clsx(inputs);
}
export function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
export function throttle(fn, limit) {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getInitials(name) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
export function truncate(str, length) {
    if (str.length <= length)
        return str;
    return str.slice(0, length) + '...';
}
export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12)
        return 'Good Morning';
    if (hour < 17)
        return 'Good Afternoon';
    return 'Good Evening';
}
export function getSeason() {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9)
        return 'Kharif';
    if (month >= 10 || month <= 1)
        return 'Rabi';
    return 'Zaid';
}
