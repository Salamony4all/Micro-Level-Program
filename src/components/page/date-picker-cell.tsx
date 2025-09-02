'use client';

import { useState } from 'react';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TableCell } from '@/components/ui/table';

interface DatePickerCellProps {
  value: string;
  onValueChange: (newValue: string) => void;
  className?: string;
  as?: 'div' | 'td';
}

export function DatePickerCell({ value, onValueChange, className, as = 'div' }: DatePickerCellProps) {
  const [open, setOpen] = useState(false);
  
  // The date from the table might be in 'yyyy-MM-dd' or other formats.
  // We try to parse it, and if it's invalid, we don't select any date.
  let date: Date | undefined = undefined;
  if (value) {
    // Try parsing yyyy-MM-dd format first.
    let parsedDate = parse(value, 'yyyy-MM-dd', new Date());
    if (isNaN(parsedDate.getTime())) {
      // Fallback for other JS-parsable date formats which might not include timezone
      parsedDate = new Date(value);
    }
    // Final check if date is valid
    if (!isNaN(parsedDate.getTime())) {
      // To prevent timezone shifts, get the UTC date parts and create a new Date
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth();
      const day = parsedDate.getDate();
      date = new Date(year, month, day, 12); // Use noon to avoid timezone boundary issues
    }
  }

  const Component = as === 'td' ? TableCell : 'div';

  return (
    <Component className={cn("p-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                onValueChange(format(selectedDate, 'yyyy-MM-dd'));
              }
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </Component>
  );
}
