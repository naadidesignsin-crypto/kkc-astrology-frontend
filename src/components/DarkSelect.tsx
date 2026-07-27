import { useEffect, useRef, useState } from "react";

type DarkSelectOption = {
  label: string;
  value: string;
};

type DarkSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options: DarkSelectOption[];
  onChange: (value: string) => void;
};

function DarkSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: DarkSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

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

  return (
    <div className={open ? "dark-control dark-select open" : "dark-control dark-select"} ref={wrapperRef}>
      <span className="dark-control-label">{label}</span>

      <button
        type="button"
        className="dark-control-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <strong>⌄</strong>
      </button>

      {open && (
        <div className="dark-select-menu" role="listbox">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={option.value === value ? "selected" : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DarkSelect;