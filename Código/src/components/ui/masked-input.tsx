import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: (value: string) => string;
  onValueChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onValueChange, error, errorMessage, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      if (mask) {
        value = mask(value);
      }
      
      if (onValueChange) {
        onValueChange(value);
      }
      
      if (onChange) {
        e.target.value = value;
        onChange(e);
      }
    };

    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          className={cn(
            error && "border-red-500 focus:border-red-500",
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
