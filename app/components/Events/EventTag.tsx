interface EventTagProps {
  label: string;
  color: 'orange' | 'blue' | 'cyan' | 'yellow' | 'red' | 'green' | 'purple' | 'pink';
}

const EventTag: React.FC<EventTagProps> = ({ label, color }) => {
  const colorClasses = {
    orange: 'bg-orange-500/20 text-orange-400',
    blue: 'bg-blue-500/20 text-blue-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <span className={`px-2 py-1 ${colorClasses[color]} text-xs rounded`}>
      {label}
    </span>
  );
};

export default EventTag;
