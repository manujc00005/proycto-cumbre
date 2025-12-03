// app/components/events/EventTag.tsx

import { EventColor, TAG_COLOR_CLASSES } from '@/lib/events-constants';

interface EventTagProps {
  label: string;
  color: EventColor;
}

const EventTag: React.FC<EventTagProps> = ({ label, color }) => {
  const colorClass = TAG_COLOR_CLASSES[color];

  return (
    <span className={`px-2 py-1 ${colorClass} text-xs rounded`}>
      {label}
    </span>
  );
};

export default EventTag;