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
            ['CIVIL WORKS', 'Architectural Works', '', '', ''],
            ['CIVIL WORKS', 'Sub-Structure Works', '', '', ''],
            ['CIVIL WORKS', 'Super-Structure Works', '', '', ''],
            ['CIVIL WORKS', 'Precast Concrete Works', '', '', ''],
            ['FINISHING WORKS', 'Block Works & Plastering', '', '', ''],
            ['FINISHING WORKS', 'Floor & Wall finishes', '', '', ''],
            ['FINISHING WORKS', 'Painting Works', '', '', ''],
            ['FINISHING WORKS', 'Doors & Windows', '', '', ''],
            ['FINISHING WORKS', 'Glazing Works', '', '', ''],
            ['FINISHING WORKS', 'Ceiling Works', '', '', ''],
            ['FINISHING WORKS', 'External Identity', '', '', ''],
            ['MEP WORKS', 'HVAC Works', '', '', ''],
            ['MEP WORKS', 'Plumbing & Drainage', '', '', ''],
            ['MEP WORKS', 'Fire Fighting Works', '', '', ''],
            ['MEP WORKS', 'Electrical Works', '', '', ''],
            ['EXTERNAL WORKS', 'Hard Landscaping Works', '', '', ''],
            ['EXTERNAL WORKS', 'Soft Landscaping Works', '', '', ''],
            ['EXTERNAL WORKS', 'External Services', '', '', ''],
            ['EXTERNAL WORKS', 'Boundary wall & Gates', '', '', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Main Activity', 'Activity/Item', 'Material Submittal Date', 'Procurement Status', 'Remarks'],
          rows: [
            ['CIVIL WORKS', 'Architectural Works', '', '🟡 Pending', ''],
            ['CIVIL WORKS', 'Sub-Structure Works', '', '🟡 Pending', ''],
            ['CIVIL WORKS', 'Super-Structure Works', '', '🟡 Pending', ''],
            ['CIVIL WORKS', 'Precast Concrete Works', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'Block Works & Plastering', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'Floor & Wall finishes', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'Painting Works', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'Doors & Windows', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'Glazing Works', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'Ceiling Works', '', '🟡 Pending', ''],
            ['FINISHING WORKS', 'External Identity', '', '🟡 Pending', ''],
            ['MEP WORKS', 'HVAC Works', '', '🟡 Pending', ''],
            ['MEP WORKS', 'Plumbing & Drainage', '', '🟡 Pending', ''],
            ['MEP WORKS', 'Fire Fighting Works', '', '🟡 Pending', ''],
            ['MEP WORKS', 'Electrical Works', '', '🟡 Pending', ''],
            ['EXTERNAL WORKS', 'Hard Landscaping Works', '', '🟡 Pending', ''],
            ['EXTERNAL WORKS', 'Soft Landscaping Works', '', '🟡 Pending', ''],
            ['EXTERNAL WORKS', 'External Services', '', '🟡 Pending', ''],
            ['EXTERNAL WORKS', 'Boundary wall & Gates', '', '🟡 Pending', ''],
          ],
        },
        {
          title: 'Execution',
          headers: ['Main Activity', 'Activity/Item', 'Execution Start Date', 'Execution Finish Date', 'Remarks'],
          rows: [
            ['CIVIL WORKS', 'Architectural Works', '', '', ''],
            ['CIVIL WORKS', 'Sub-Structure Works', '', '', ''],
            ['CIVIL WORKS', 'Super-Structure Works', '', '', ''],
            ['CIVIL WORKS', 'Precast Concrete Works', '', '', ''],
            ['FINISHING WORKS', 'Block Works & Plastering', '', '', ''],
            ['FINISHING WORKS', 'Floor & Wall finishes', '', '', ''],
            ['FINISHING WORKS', 'Painting Works', '', '', ''],
            ['FINISHING WORKS', 'Doors & Windows', '', '', ''],
            ['FINISHING WORKS', 'Glazing Works', '', '', ''],
            ['FINISHING WORKS', 'Ceiling Works', '', '', ''],
            ['FINISHING WORKS', 'External Identity', '', '', ''],
            ['MEP WORKS', 'HVAC Works', '', '', ''],
            ['MEP WORKS', 'Plumbing & Drainage', '', '', ''],
            ['MEP WORKS', 'Fire Fighting Works', '', '', ''],
            ['MEP WORKS', 'Electrical Works', '', '', ''],
            ['EXTERNAL WORKS', 'Hard Landscaping Works', '', '', ''],
            ['EXTERNAL WORKS', 'Soft Landscaping Works', '', '', ''],
            ['EXTERNAL WORKS', 'External Services', '', '', ''],
            ['EXTERNAL WORKS', 'Boundary wall & Gates', '', '', ''],
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
          <LogoIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">Alshaya Enterprises ™</h1>
            <p className="text-sm text-muted-foreground">Micro level Program / Action Plan</p>
          </div>
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
