import * as React from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onChange, onValueChange, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white shadow-sm outline-none transition focus:border-cyan-400",
        className
      )}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
      }}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className, ...props }, ref) => (
    <option ref={ref} className={cn("bg-slate-950 text-white", className)} {...props} />
  )
);
SelectItem.displayName = "SelectItem";

export { Select, SelectItem };
