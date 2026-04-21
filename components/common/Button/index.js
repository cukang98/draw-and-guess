import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-white text-purple-600 border-2 border-purple-200 shadow-md hover:shadow-lg',
  danger: 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md hover:shadow-lg',
  ghost: 'bg-transparent text-purple-500 hover:bg-purple-50',
  success: 'bg-gradient-to-r from-green-400 to-teal-400 text-white shadow-md hover:shadow-lg',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    className={[
      'font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2',
      variants[variant],
      sizes[size],
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      className,
    ].join(' ')}
  >
    {children}
  </motion.button>
);

export default Button;
