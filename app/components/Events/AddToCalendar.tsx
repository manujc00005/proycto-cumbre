import React from "react";

interface CalendarEvent {
  title: string;
  startDate: string; // Format: YYYYMMDDTHHMMSS
  endDate: string; // Format: YYYYMMDDTHHMMSS
  description: string;
  location: string;
}

interface AddToCalendarProps {
  event: CalendarEvent;
  dropdownId?: string;
  className?: string;
}

export const AddToCalendar: React.FC<AddToCalendarProps> = ({
  event,
  dropdownId = "calendar-dropdown",
  className = "",
}) => {
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  const closeDropdown = () => {
    document.getElementById(dropdownId)?.classList.add("hidden");
  };

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

  // iCal format (.ics file)
  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${event.startDate}
DTEND:${event.endDate}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

  const icalDataUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icalContent)}`;

  // Outlook URL - needs different date format
  const formatOutlookDate = (date: string) => {
    // Convert from YYYYMMDDTHHMMSS to YYYY-MM-DDTHH:MM
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(9, 11)}:${date.slice(11, 13)}`;
  };

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${formatOutlookDate(event.startDate)}&enddt=${formatOutlookDate(event.endDate)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

  return (
    <div className={`relative ml-auto ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs rounded border border-zinc-700 hover:border-zinc-600 transition-all"
      >
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
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
        <span className="hidden sm:inline">Añadir al calendario</span>
        <span className="sm:hidden">Calendario</span>
        <svg
          className="w-3 h-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        id={dropdownId}
        className="hidden absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[220px] max-w-[280px]"
      >
        {/* Google Calendar */}
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-zinc-800 transition rounded-t-lg"
          onClick={closeDropdown}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span className="text-xs sm:text-sm text-white">Google Calendar</span>
        </a>

        {/* Apple Calendar / iCal */}
        <a
          href={icalDataUrl}
          download={`${event.title.toLowerCase().replace(/\s+/g, "-")}.ics`}
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-zinc-800 transition"
          onClick={closeDropdown}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 flex-shrink-0"
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
          <span className="text-xs sm:text-sm text-white">Apple / iCal</span>
        </a>

        {/* Outlook */}
        <a
          href={outlookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-zinc-800 transition rounded-b-lg"
          onClick={closeDropdown}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M24 7.387v9.226a.577.577 0 01-.577.577H7.577A.577.577 0 017 16.613V7.387a.577.577 0 01.577-.577h15.846a.577.577 0 01.577.577z" />
          </svg>
          <span className="text-xs sm:text-sm text-white">Outlook</span>
        </a>
      </div>
    </div>
  );
};
