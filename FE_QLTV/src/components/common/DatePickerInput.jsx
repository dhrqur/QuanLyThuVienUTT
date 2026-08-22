import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

import { formatDisplayDate } from "@/utils/dateUtils";

function DatePickerInput({
  className = "",
  defaultValue = "",
  min,
  name,
  onChange,
  readOnly = false,
  required = false,
  value,
}) {
  const pickerRef = useRef(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  function handleChange(event) {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(event);
  }

  function openPicker() {
    if (readOnly) return;

    if (pickerRef.current?.showPicker) {
      pickerRef.current.showPicker();
    } else {
      pickerRef.current?.click();
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        className={`h-10 w-full rounded-lg border border-slate-200 px-3 pr-11 text-sm font-semibold outline-none transition ${
          readOnly
            ? "cursor-not-allowed bg-slate-50 text-slate-500"
            : "bg-white text-slate-700 focus:border-orange-300 focus:ring-3 focus:ring-orange-100"
        }`}
        onClick={openPicker}
        placeholder="dd/mm/yyyy"
        readOnly
        type="text"
        value={formatDisplayDate(currentValue)}
      />
      <button
        aria-label="Chọn ngày"
        className={`absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md transition ${
          readOnly
            ? "cursor-not-allowed text-slate-300"
            : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
        }`}
        disabled={readOnly}
        onClick={openPicker}
        type="button"
      >
        <CalendarDays className="size-4" />
      </button>
      <input
        className="pointer-events-none absolute size-px opacity-0"
        min={min}
        name={name}
        onChange={handleChange}
        readOnly={readOnly}
        ref={pickerRef}
        required={required}
        type="date"
        value={currentValue}
      />
    </div>
  );
}

export default DatePickerInput;
