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
            ['Civil Works', 'Architectural Submittals', '', '', ''],
            ['Civil Works', 'Structural Submittals', '', '', ''],
            ['Civil Works', 'Block Work', '', '', ''],
            ['Civil Works', 'Plastering', '', '', ''],
            ['Civil Works', 'Flooring', '', '', ''],
            ['Finishing Works', 'Painting', '', '', ''],
            ['Finishing Works', 'Doors & Windows', '', '', ''],
            ['Finishing Works', 'Sanitary Wares', '', '', ''],
            ['MEP Works', 'Electrical First Fix', '', '', ''],
            ['MEP Works', 'Plumbing First Fix', '', '', ''],
            ['MEP Works', 'HVAC First Fix', '', '', ''],
            ['MEP Works', 'Electrical Second Fix', '', '', ''],
            ['MEP Works', 'Plumbing Second Fix', '', '', ''],
            ['MEP Works', 'HVAC Second Fix', '', '', ''],
            ['External Works', 'Boundary Wall', '', '', ''],
            ['External Works', 'Paving', '', '', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Main Activity', 'Activity/Item', 'Material Submittal Date', 'Procurement Status', 'Remarks'],
          rows: [
            ['Civil Works', 'Architectural Submittals', '', '🟡 Pending', ''],
            ['Civil Works', 'Structural Submittals', '', '🟡 Pending', ''],
            ['Civil Works', 'Block Work', '', '🟡 Pending', ''],
            ['Civil Works', 'Plastering', '', '🟡 Pending', ''],
            ['Civil Works', 'Flooring', '', '🟡 Pending', ''],
            ['Finishing Works', 'Painting', '', '🟡 Pending', ''],
            ['Finishing Works', 'Doors & Windows', '', '🟡 Pending', ''],
            ['Finishing Works', 'Sanitary Wares', '', '🟡 Pending', ''],
            ['MEP Works', 'Electrical First Fix', '', '🟡 Pending', ''],
            ['MEP Works', 'Plumbing First Fix', '', '🟡 Pending', ''],
            ['MEP Works', 'HVAC First Fix', '', '🟡 Pending', ''],
            ['MEP Works', 'Electrical Second Fix', '', '🟡 Pending', ''],
            ['MEP Works', 'Plumbing Second Fix', '', '🟡 Pending', ''],
            ['MEP Works', 'HVAC Second Fix', '', '🟡 Pending', ''],
            ['External Works', 'Boundary Wall', '', '🟡 Pending', ''],
            ['External Works', 'Paving', '', '🟡 Pending', ''],
          ],
        },
        {
          title: 'Execution',
          headers: ['Main Activity', 'Activity/Item', 'Execution Start Date', 'Execution Finish Date', 'Remarks'],
          rows: [
            ['Civil Works', 'Architectural Submittals', '', '', ''],
            ['Civil Works', 'Structural Submittals', '', '', ''],
            ['Civil Works', 'Block Work', '', '', ''],
            ['Civil Works', 'Plastering', '', '', ''],
            ['Civil Works', 'Flooring', '', '', ''],
            ['Finishing Works', 'Painting', '', '', ''],
            ['Finishing Works', 'Doors & Windows', '', '', ''],
            ['Finishing Works', 'Sanitary Wares', '', '', ''],
            ['MEP Works', 'Electrical First Fix', '', '', ''],
            ['MEP Works', 'Plumbing First Fix', '', '', ''],
            ['MEP Works', 'HVAC First Fix', '', '', ''],
            ['MEP Works', 'Electrical Second Fix', '', '', ''],
            ['MEP Works', 'Plumbing Second Fix', '', '', ''],
            ['MEP Works', 'HVAC Second Fix', '', '', ''],
            ['External Works', 'Boundary Wall', '', '', ''],
            ['External Works', 'Paving', '', '', ''],
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
