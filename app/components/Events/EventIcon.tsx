// app/components/events/EventIcon.tsx

import {
  IconType,
  EventColor,
  ICON_COLOR_CLASSES,
} from "@/lib/events-constants";
import { JSX } from "react";

interface EventIconProps {
  type: IconType;
  color?: EventColor;
}

const EventIcon: React.FC<EventIconProps> = ({ type, color = "orange" }) => {
  const colorClass = ICON_COLOR_CLASSES[color];

  // 🎯 Crear objeto de iconos DENTRO del componente para que tenga acceso a colorClass
  const icons: Record<IconType, JSX.Element> = {
    runner: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
      </svg>
    ),
    mountain: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 20l5-7 4 4 5-7 4 5v5H3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 4v3M12 2v4M16 4v3M6 8v2M10 6v3M14 7v2M18 8v2"
        />
      </svg>
    ),
    calendar: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    climbing: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M5.5 12H8V8.5C7.5 8.4 7 8.2 6.6 7.8L4.4 9.3C4.2 9.5 4 9.7 4 10C4 10.6 4.4 11 5 11H5.5M21 11H16V15L13.5 17.2L15.2 22H17.7L19.1 17.5L21.5 15.5C21.9 15.2 22 14.6 21.7 14.1L19.5 10.5C19.2 10 18.5 9.9 18 10.3L15 12.5V8C15 6.3 13.7 5 12 5S9 6.3 9 8V15L6 13L5 14L9 17L11 19V22H13V18.5L11.2 16.7L13 15V11H15V13.5L19 10.3L21 11Z" />
      </svg>
    ),
    bike: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 19a4 4 0 100-8 4 4 0 000 8zm14 0a4 4 0 100-8 4 4 0 000 8zM8.5 8.5l2-3 1.5 1 3-3M12 14l-4 5m7-5l1.5-4.5"
        />
      </svg>
    ),
    volleyball: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M12 4C14.21 4 16.21 4.9 17.62 6.36L12 10.66V4M4 12C4 10.74 4.25 9.55 4.69 8.47L9.66 13.26L4.09 14.69C4.03 13.81 4 12.91 4 12M6.36 17.62C5.31 16.44 4.58 14.94 4.36 13.27L9.93 11.84L11.27 19.64C9.15 19.5 7.24 18.8 6.36 17.62M12 20C11.55 20 11.11 19.96 10.67 19.91L9.4 12.43L15 8.14V20C13.75 20 12.82 20 12 20M19.64 17.62C18.76 18.8 16.85 19.5 14.73 19.64L16.07 11.84L19.64 13.27C19.42 14.94 18.69 16.44 17.62 17.62M19.91 10.67L14.34 8.26L19.96 4C20.84 5.6 21.46 7.44 21.82 9.44C21.21 9.91 20.56 10.31 19.91 10.67Z" />
      </svg>
    ),
    beer: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4 3C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H9C10.1 21 11 20.1 11 19V17H15C16.7 17 18 15.7 18 14V10C19.7 10 21 8.7 21 7V6C21 4.9 20.1 4 19 4H18V3H4M6 5H9V7H6V5M6 9H9V11H6V9M6 13H9V15H6V13Z" />
      </svg>
    ),
    beach: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 17h18M5 21h14M7 13l3-3 3 3 3-3M12 3v7m0 0l-3-3m3 3l3-3"
        />
        <circle cx="12" cy="3" r="1" fill="currentColor" />
      </svg>
    ),
    weights: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" />
      </svg>
    ),
    hyrox: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M15.9 8.1C15.5 7.7 14.8 7.7 14.4 8.1L12 10.5L9.6 8.1C9.2 7.7 8.5 7.7 8.1 8.1C7.7 8.5 7.7 9.2 8.1 9.6L11 12.5V22H13V12.5L15.9 9.6C16.3 9.2 16.3 8.5 15.9 8.1M19 16V13H22V11H19V8L18 7L16 9V11H5V13H16V15L18 17L19 16Z" />
      </svg>
    ),
    swimming: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M2 15C3.67 14.25 5 14.25 6 15C7 15.75 8.33 15.75 10 15C11.67 14.25 13 14.25 14 15C15 15.75 16.33 15.75 18 15C19.67 14.25 21 14.25 22 15V17C20.33 16.25 19 16.25 18 17C17 17.75 15.67 17.75 14 17C12.33 16.25 11 16.25 10 17C9 17.75 7.67 17.75 6 17C4.33 16.25 3 16.25 2 17V15M18 8C18.56 8 19.08 8.25 19.42 8.68C19.77 9.1 19.91 9.66 19.79 10.2L19.26 12.5C18.5 12.37 17.76 12.44 17 12.69C16.85 12.74 16.71 12.8 16.56 12.86L17.03 10.88L16.19 10.5L14.93 11.66C14.75 11.06 14.16 10.63 13.5 10.63H10.89C10.26 10.63 9.72 11.05 9.5 11.63L8.21 10.5L7.37 10.88L7.84 12.86C7.69 12.8 7.55 12.74 7.41 12.69C6.64 12.44 5.89 12.37 5.13 12.5L4.6 10.2C4.5 9.66 4.62 9.1 4.97 8.68C5.31 8.25 5.82 8 6.39 8H18M18 5H6C4 5 2.5 6.5 2.5 8.5C2.5 9.35 2.79 10.13 3.26 10.74L4.5 15.03C5.05 14.9 5.56 14.85 6 14.85C7 14.85 8.33 15.06 10 15.85C11.67 15.06 13 14.85 14 14.85C15 14.85 16.33 15.06 18 15.85C19.67 15.06 21 14.85 22 14.85V8.5C22 6.5 20.5 5 18 5Z" />
      </svg>
    ),
    hiking: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.5 5.5C14.59 5.5 15.5 4.58 15.5 3.5S14.59 1.5 13.5 1.5 11.5 2.42 11.5 3.5 12.42 5.5 13.5 5.5M9.89 19.38L10.89 15L13 17V23H15V15.5L12.89 13.5L13.5 10.5C14.79 12 16.79 13 19 13V11C17.09 11 15.5 10 14.69 8.58L13.69 7.08C13.29 6.38 12.69 6 11.69 6C11.29 6 10.89 6.08 10.59 6.38L6 9.7V14H8V10.6L9.79 9.21L8.19 17L3.29 16L2.89 18L9.89 19.38Z" />
      </svg>
    ),
    yoga: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M8.5 7L9.5 9L7 11V22H9V16L10.5 17.5L11.5 22H14L12.8 15.8L14 14L15.5 22H18L16.5 13.5L19 12.5V9H13V11L15 12.5L13.5 14L12 12V9L13 7H8.5Z" />
      </svg>
    ),
    soccer: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M13 5.3L14.35 8.57L17.5 9.3L14.59 11.59L15.59 14.87L13 13.31L10.41 14.87L11.41 11.59L8.5 9.3L11.65 8.57L13 5.3M9.5 13.31L8.07 17.43L6.5 13.13L9.5 13.31M14.5 13.31L17.5 13.13L15.93 17.43L14.5 13.31Z" />
      </svg>
    ),
    paddle: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.57,10.66C21.53,8.85 21.5,6.57 20.47,4.76L19.06,6.17C19.67,7.37 19.65,8.88 19.03,10.09L20.57,10.66M5.5,5.5L7.96,8L5.5,10.5L8,13L10.5,10.5L13,13L15.5,10.5L13,8L15.5,5.5L13,3L10.5,5.5L8,3L5.5,5.5M18.53,4.76C17.5,2.94 15.23,1.91 13.42,2.87L11.88,4.41C13.09,3.79 14.6,3.81 15.81,4.43L17.22,3C17.62,3.39 18,3.85 18.36,4.34L18.53,4.76M7.03,10.09C6.42,8.88 6.39,7.37 7,6.17L5.59,4.76C4.56,6.57 4.53,8.85 5.5,10.66L7.03,10.09M11.88,19.59C10.67,20.21 9.16,20.18 7.96,19.57L6.54,21C8.35,22 10.63,22.06 12.44,21.03L11.88,19.59M15.5,18.5L13,16L10.5,18.5L8,16L5.5,18.5L8,21L10.5,18.5L13,21L15.5,18.5M20.47,19.24L19.06,17.83C19.67,16.63 19.65,15.12 19.03,13.91L20.57,13.34C21.53,15.15 21.5,17.43 20.47,19.24Z" />
      </svg>
    ),
    crossfit: (
      <svg
        className={`w-12 h-12 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86M9 4C9 3.45 9.45 3 10 3S11 3.45 11 4 10.55 5 10 5 9 4.55 9 4M14 19C14 19.55 13.55 20 13 20S12 19.55 12 19 12.45 18 13 18 14 18.45 14 19Z" />
      </svg>
    ),
  };

  return (
    <div className="flex-shrink-0 ml-4 hidden md:block">{icons[type]}</div>
  );
};

export default EventIcon;
