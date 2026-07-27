import { useEffect, useRef, useState } from "react";

type DarkDatePickerProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function fromDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDisplayDate(value: string) {
  const date = fromDateValue(value);

  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    return new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + index
    );
  });
}

function isSameDay(first: Date | null, second: Date) {
  if (!first) {
    return false;
  }

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function DarkDatePicker({
  label,
  value,
  placeholder,
  onChange,
}: DarkDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = fromDateValue(value);
  const [viewDate, setViewDate] = useState<Date>(selectedDate || new Date());

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const monthLabel = viewDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = getCalendarDays(viewDate);

  useEffect(() => {
    const selected = fromDateValue(value);

    if (selected) {
      setViewDate(selected);
    }
  }, [value]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  function moveMonth(amount: number) {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  }

  function selectDate(date: Date) {
    onChange(toDateValue(date));
    setOpen(false);
  }

  return (
    <div
      className={open ? "dark-control dark-date-picker open" : "dark-control dark-date-picker"}
      ref={wrapperRef}
    >
      <span className="dark-control-label">{label}</span>

      <button
        type="button"
        className="dark-control-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span>{formatDisplayDate(value) || placeholder}</span>
        <strong>⌄</strong>
      </button>

      {open && (
        <div className="dark-calendar-panel">
          <div className="dark-calendar-head">
            <button type="button" onClick={() => moveMonth(-1)}>
              ←
            </button>

            <strong>{monthLabel}</strong>

            <button type="button" onClick={() => moveMonth(1)}>
              →
            </button>
          </div>

          <div className="dark-calendar-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="dark-calendar-grid">
            {calendarDays.map((date) => {
              const outsideMonth = date.getMonth() !== viewDate.getMonth();
              const selected = isSameDay(selectedDate, date);
              const today = isSameDay(new Date(), date);

              return (
                <button
                  type="button"
                  key={date.getTime()}
                  className={[
                    outsideMonth ? "outside-month" : "",
                    selected ? "selected" : "",
                    today ? "today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="dark-calendar-actions">
            <button type="button" onClick={() => onChange("")}>
              Clear
            </button>

            <button type="button" onClick={() => selectDate(new Date())}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DarkDatePicker;