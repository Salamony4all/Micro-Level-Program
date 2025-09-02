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
          headers: ['Main Activity', 'Activity/Item', 'Shop Drawing Submission Date', 'Shop Drawing Approval Date', 'Remarks'],
          rows: [
            ['Sub-structure', 'Civil Works', '2025-09-03', '2025-09-03', ''],
            ['Super-structure', 'Civil Works', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Block Works', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Plastering', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Flooring', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Wall finish', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Ceiling', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Joinery', '2025-09-03', '2025-09-03', ''],
            ['Facades', 'Curtain Walls', '2025-09-03', '2025-09-03', ''],
            ['Facades', 'Canopy', '2025-09-03', '2025-09-03', ''],
            ['Facades', 'Cladding', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Landscape', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Hardscape', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Pool', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Gate/Fence', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Services', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Sub-station', '2025-09-03', '2025-09-03', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Main Activity', 'Activity/Item', 'Material Submittal Date', 'Procurement Status', 'Remarks'],
          rows: [
            ['Sub-structure', 'Civil Works', '2025-09-03', '🟡 Pending', ''],
            ['Super-structure', 'Civil Works', '2025-09-03', '🟡 Pending', ''],
            ['Finishes', 'Block Works', '2025-09-03', '🟡 Pending', ''],
            ['Finishes', 'Plastering', '2025-09-03', '🟡 Pending', ''],
            ['Finishes', 'Flooring', '2025-09-03', '🟡 Pending', ''],
            ['Finishes', 'Wall finish', '2025-09-03', '🟡 Pending', ''],
            ['Finishes', 'Ceiling', '2025-09-03', '🟡 Pending', ''],
            ['Finishes', 'Joinery', '2025-09-03', '🟡 Pending', ''],
            ['Facades', 'Curtain Walls', '2025-09-03', '🟡 Pending', ''],
            ['Facades', 'Canopy', '2025-09-03', '🟡 Pending', ''],
            ['Facades', 'Cladding', '2025-09-03', '🟡 Pending', ''],
            ['Other', 'Landscape', '2025-09-03', '🟡 Pending', ''],
            ['Other', 'Hardscape', '2025-09-03', '🟡 Pending', ''],
            ['Other', 'Pool', '2025-09-03', '🟡 Pending', ''],
            ['Other', 'Gate/Fence', '2025-09-03', '🟡 Pending', ''],
            ['Other', 'Services', '2025-09-03', '🟡 Pending', ''],
            ['Other', 'Sub-station', '2025-09-03', '🟡 Pending', ''],
          ],
        },
        {
          title: 'Execution',
          headers: ['Main Activity', 'Activity/Item', 'Execution Start Date', 'Execution Finish Date', 'Remarks'],
          rows: [
            ['Sub-structure', 'Civil Works', '2025-09-03', '2025-09-03', ''],
            ['Super-structure', 'Civil Works', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Block Works', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Plastering', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Flooring', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Wall finish', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Ceiling', '2025-09-03', '2025-09-03', ''],
            ['Finishes', 'Joinery', '2025-09-03', '2025-09-03', ''],
            ['Facades', 'Curtain Walls', '2025-09-03', '2025-09-03', ''],
            ['Facades', 'Canopy', '2025-09-03', '2025-09-03', ''],
            ['Facades', 'Cladding', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Landscape', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Hardscape', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Pool', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Gate/Fence', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Services', '2025-09-03', '2025-09-03', ''],
            ['Other', 'Sub-station', '2025-09-03', '2025-09-03', ''],
          ],
        },
      ],
    },
  ],
};


export default function Home() {
  const [data, setData] = useState<ExtractTablesOutput | null>(null);

  const handleReset = () => {
    setData(staticData);
  };
  
  // Set initial data on component mount
  useState(() => {
    setData(staticData);
  });

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
          {data ? (
            <TableViewer 
              initialData={data} 
              onReset={handleReset}
              fileName="NCSI Action Plan 2-9-2025 1.pdf"
            />
          ) : (
            <div>Loading...</div>
          )}
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
