interface EventIconProps {
  type: 'runner' | 'mountain';
  color?: 'orange' | 'red' | 'blue' | 'cyan' | 'yellow' | 'green' | 'purple' | 'pink';
}

const EventIcon: React.FC<EventIconProps> = ({ type, color = 'orange' }) => {
  const colorClasses = {
    orange: 'text-orange-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
  };

  const icons = {
    runner: (
      <svg className={`w-12 h-12 ${colorClasses[color]}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
      </svg>
    ),
    mountain: (
      <svg className={`w-12 h-12 ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20l5-7 4 4 5-7 4 5v5H3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4v3M12 2v4M16 4v3M6 8v2M10 6v3M14 7v2M18 8v2" />
      </svg>
    ),
  };

  return (
    <div className="flex-shrink-0 ml-4 hidden md:block">
      {icons[type]}
    </div>
  );
};

export default EventIcon;
