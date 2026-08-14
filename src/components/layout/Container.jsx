const sizeMap = {
    sm: 'max-w-3xl', // ~768px
    md: 'max-w-5xl', // ~1024px
    lg: 'max-w-[1400px]', // ~1400px (standard wide width to decrease left/right empty space)
    xl: 'max-w-[1536px]', // ~1536px
    full: 'max-w-none',
};
export default function Container({ children, className = '', clean = false, size = 'lg' }) {
    return (<div className={`${sizeMap[size]} mx-auto px-4 md:px-5 ${clean ? '' : 'py-6'} ${className}`}>
      {children}
    </div>);
}
