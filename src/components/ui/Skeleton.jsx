import './Skeleton.css';

export default function Skeleton({ className = '', variant = 'rectangular', width, height }) {
    const variantClasses = {
        text: 'skeleton-text',
        circular: 'skeleton-circular',
        rectangular: 'skeleton-rectangular',
    };
    return (<div className={`
        skeleton ${variantClasses[variant]} ${className}
      `} style={{ width, height }} aria-hidden="true">
      <div className="skeleton-shimmer animate-shimmer"/>
    </div>);
}
