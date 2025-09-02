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
            ['Civil Works', 'Sub-structure works', '2025-09-03', '2025-09-03', ''],
            ['Civil Works', 'Super-structure works', '2025-09-03', '2025-09-03', ''],
            ['Civil Works', 'Block works', '2025-09-03', '2025-09-03', ''],
            ['Civil Works', 'Plastering works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Painting works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Flooring works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Ceiling works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Joinery works', '2025-09-03', '2025-09-03', ''],
            ['Facade Works', 'Glazing works', '2025-09-03', '2025-09-03', ''],
            ['Facade Works', 'Cladding works', '2025-09-03', '2025-09-03', ''],
            ['External Works', 'Hardscaping', '2025-09-03', '2025-09-03', ''],
            ['External Works', 'Softscaping', '2025-09-03', '2025-09-03', ''],
            ['MEP Works', 'HVAC', '2025-09-03', '2025-09-03', ''],
            ['MEP Works', 'Electrical', '2025-09-03', '2025-09-03', ''],
            ['MEP Works', 'Plumbing', '2025-09-03', '2025-09-03', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Main Activity', 'Activity/Item', 'Material Submittal Date', 'Procurement Status', 'Remarks'],
          rows: [
            ['Civil Works', 'Sub-structure works', '2025-09-03', '🟡 Pending', ''],
            ['Civil Works', 'Super-structure works', '2025-09-03', '🟡 Pending', ''],
            ['Civil Works', 'Block works', '2025-09-03', '🟡 Pending', ''],
            ['Civil Works', 'Plastering works', '2025-09-03', '🟡 Pending', ''],
            ['Finishing Works', 'Painting works', '2025-09-03', '🟡 Pending', ''],
            ['Finishing Works', 'Flooring works', '2025-09-03', '🟡 Pending', ''],
            ['Finishing Works', 'Ceiling works', '2025-09-03', '🟡 Pending', ''],
            ['Finishing Works', 'Joinery works', '2025-09-03', '🟡 Pending', ''],
            ['Facade Works', 'Glazing works', '2025-09-03', '🟡 Pending', ''],
            ['Facade Works', 'Cladding works', '2025-09-03', '🟡 Pending', ''],
            ['External Works', 'Hardscaping', '2025-09-03', '🟡 Pending', ''],
            ['External Works', 'Softscaping', '2025-09-03', '🟡 Pending', ''],
            ['MEP Works', 'HVAC', '2025-09-03', '🟡 Pending', ''],
            ['MEP Works', 'Electrical', '2025-09-03', '🟡 Pending', ''],
            ['MEP Works', 'Plumbing', '2025-09-03', '🟡 Pending', ''],
          ],
        },
        {
          title: 'Execution',
          headers: ['Main Activity', 'Activity/Item', 'Execution Start Date', 'Execution Finish Date', 'Remarks'],
          rows: [
            ['Civil Works', 'Sub-structure works', '2025-09-03', '2025-09-03', ''],
            ['Civil Works', 'Super-structure works', '2025-09-03', '2025-09-03', ''],
            ['Civil Works', 'Block works', '2025-09-03', '2025-09-03', ''],
            ['Civil Works', 'Plastering works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Painting works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Flooring works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Ceiling works', '2025-09-03', '2025-09-03', ''],
            ['Finishing Works', 'Joinery works', '2025-09-03', '2025-09-03', ''],
            ['Facade Works', 'Glazing works', '2025-09-03', '2025-09-03', ''],
            ['Facade Works', 'Cladding works', '2025-09-03', '2025-09-03', ''],
            ['External Works', 'Hardscaping', '2025-09-03', '2025-09-03', ''],
            ['External Works', 'Softscaping', '2025-09-03', '2025-09-03', ''],
            ['MEP Works', 'HVAC', '2025-09-03', '2025-09-03', ''],
            ['MEP Works', 'Electrical', '2025-09-03', '2025-09-03', ''],
            ['MEP Works', 'Plumbing', '2025-09-03', '2025-09-03', ''],
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
          <h1 className="text-2xl font-bold text-primary">Alshaya Enterprises ™</h1>
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
