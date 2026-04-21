const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  maxLength,
  onKeyDown,
  autoFocus = false,
  label,
  disabled = false,
}) => (
  <div className="flex flex-col gap-1 w-full">
    {label && (
      <label className="text-sm font-bold text-purple-700">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyDown={onKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      disabled={disabled}
      className={[
        'w-full px-4 py-3 rounded-2xl border-2 border-purple-200',
        'focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100',
        'transition-all duration-200 font-semibold text-gray-700 placeholder-gray-400',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white',
        className,
      ].join(' ')}
    />
  </div>
);

export default Input;
