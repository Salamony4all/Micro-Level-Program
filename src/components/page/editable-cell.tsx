'use client';

import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  value: string;
  onValueChange: (newValue: string) => void;
  className?: string;
}

export function EditableCell({ value, onValueChange, className }: EditableCellProps) {
  return (
    <TableCell
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        if (e.currentTarget.textContent !== value) {
            onValueChange(e.currentTarget.textContent || '');
        }
      }}
      className={cn(
        "cursor-text transition-colors duration-200",
        "focus:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm",
        className
      )}
    >
      {value}
    </TableCell>
  );
}
