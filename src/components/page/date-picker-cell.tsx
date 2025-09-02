'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
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
}

export function DatePickerCell({ value, onValueChange, className }: DatePickerCellProps) {
  const [open, setOpen] = useState(false);
  
  // The date from the table might be in 'yyyy-MM-dd' or other formats.
  // We try to parse it, and if it's invalid, we don't select any date.
  const date = value ? new Date(value + 'T00:00:00') : undefined; // Add time to avoid timezone issues

  return (
    <TableCell className={cn("p-2", className)}>
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
    </TableCell>
  );
}
