"use client";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type GenderSelectorProps = {
  options?: Option[];
  value: string;
  onChange: (value: string) => void;
};

const defaultOptions: Option[] = [
  { value: 'male', label: 'Male', icon: <span className="text-3xl">👨</span> },
  { value: 'female', label: 'Female', icon: <span className="text-3xl">👩</span> },
  { value: 'other', label: 'Other', icon: <span className="text-3xl">🌈</span> },
];

export function GenderSelector({ options = defaultOptions, value, onChange }: GenderSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-col items-center justify-center h-24 p-4 rounded-lg border-2 transition-all duration-200",
            value === option.value
              ? "border-primary bg-primary/10"
              : "border-input bg-transparent hover:bg-muted"
          )}
        >
          {option.icon}
          <span className="mt-2 font-medium text-sm">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
