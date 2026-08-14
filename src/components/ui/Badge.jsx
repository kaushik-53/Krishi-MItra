import './Badge.css';

const variantMap = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
};
const sizeMap = {
    sm: 'badge-sm',
    md: 'badge-md',
};
export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
    return (<span className={`badge ${variantMap[variant]} ${sizeMap[size]} ${className}`}>
      {children}
    </span>);
}
