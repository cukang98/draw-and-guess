import Button from '@/components/common/Button';

const CreateRoom = ({ onCreateRoom, isLoading }) => (
  <Button
    onClick={onCreateRoom}
    disabled={isLoading}
    variant="primary"
    size="lg"
    className="w-full"
  >
    {isLoading ? '✨ Creating...' : '🎨 Create New Room'}
  </Button>
);

export default CreateRoom;
