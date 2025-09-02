'use client';

import { format, parse } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerCell } from './date-picker-cell'; // Using this for consistency

export type ProjectDetailsData = {
  date: string;
  referenceNumber: string;
  projectName: string;
  clientName: string;
  clientContactPerson: string;
};

interface ProjectDetailsProps {
  data: ProjectDetailsData;
  onDataChange: (data: ProjectDetailsData) => void;
}

export function ProjectDetails({ data, onDataChange }: ProjectDetailsProps) {
  const handleChange = (field: keyof ProjectDetailsData, value: string) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePickerCell
            value={data.date}
            onValueChange={(newValue) => handleChange('date', newValue)}
            className="p-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference Number</Label>
          <Input
            id="referenceNumber"
            value={data.referenceNumber}
            onChange={(e) => handleChange('referenceNumber', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={data.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={data.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientContactPerson">Client Contact Person</Label>
          <Input
            id="clientContactPerson"
            value={data.clientContactPerson}
            onChange={(e) => handleChange('clientContactPerson', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
