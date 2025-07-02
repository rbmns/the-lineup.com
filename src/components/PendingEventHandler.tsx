import { usePendingEventPublisher } from '@/hooks/usePendingEventPublisher';

export const PendingEventHandler: React.FC = () => {
  usePendingEventPublisher();
  return null; // This component doesn't render anything
};