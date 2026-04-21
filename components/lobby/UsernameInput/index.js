import Input from '@/components/common/Input';

const UsernameInput = ({ value, onChange }) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Enter your name..."
    label="Your Name"
    maxLength={20}
    autoFocus
  />
);

export default UsernameInput;
