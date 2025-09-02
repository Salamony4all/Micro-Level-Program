'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface StatusDropdownCellProps {
  value: string;
  onValueChange: (newValue: string) => void;
  className?: string;
}

const statusOptions = [
  { value: "🟢 Completed", label: "🟢 Completed" },
  { value: "🟡 Pending", label: "🟡 Pending" },
  { value: "🟠 In Progress", label: "🟠 In Progress" },
  { value: "🔴 Delayed", label: "🔴 Delayed" }
];

export function StatusDropdownCell({ value, onValueChange, className }: StatusDropdownCellProps) {
  const currentStatus = statusOptions.find(option => value?.includes(option.value.split(' ')[1]))?.value || "🟡 Pending";
  
  return (
    <TableCell className={cn("p-2", className)}>
      <Select onValueChange={onValueChange} defaultValue={currentStatus}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
