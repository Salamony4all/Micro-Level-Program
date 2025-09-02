'use client';

import { useState } from 'react';
import type { ExtractTablesOutput } from '@/types';
import { LogoIcon } from '@/components/icons';
import { TableViewer } from '@/components/page/table-viewer';

const staticData: ExtractTablesOutput = {
  locations: [
    {
      location: 'NCSI Action Plan',
      tables: [
        {
          title: 'Engineering',
          headers: ['Activity ID', 'Activity Name', 'Shop Drawing Submission Date', 'Shop Drawing Approval Date'],
          rows: [
            ['ENG-001', 'Structural Drawings', '2024-09-15', ''],
            ['ENG-002', 'Architectural Drawings', '2024-09-20', ''],
            ['ENG-003', 'MEP Drawings', '2024-09-25', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Activity ID', 'Activity Name', 'Material Submittal Date', 'Procurement Status'],
          rows: [
            ['PROC-001', 'Steel Beams', '2024-10-01', '🟡 Pending'],
            ['PROC-002', 'Concrete Mix', '2024-10-05', '🟠 In Progress'],
            ['PROC-003', 'Electrical Fixtures', '2024-10-10', '🟢 Completed'],
          ],
        },
        {
          title: 'Execution',
          headers: ['Activity ID', 'Activity Name', 'Execution Start Date', 'Execution Finish Date'],
          rows: [
            ['EXEC-001', 'Foundation Work', '2024-11-01', ''],
            ['EXEC-002', 'Framing', '2024-11-15', ''],
            ['EXEC-003', 'Roofing', '2024-12-01', ''],
          ],
        },
      ],
    },
  ],
};


export default function Home() {
  const [data, setData] = useState<ExtractTablesOutput>(staticData);

  const handleReset = () => {
    setData(staticData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-3">
          <LogoIcon className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-primary">TabulaLens</h1>
        </div>
      </header>
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
            <TableViewer 
              initialData={data} 
              onReset={handleReset}
              fileName="NCSI Action Plan 2-9-2025 1.pdf"
            />
        </div>
      </main>
      <footer className="p-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by GenAI. Extract tables from your documents with ease.</p>
        </div>
      </footer>
    </div>
  );
}
