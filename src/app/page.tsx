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
            ['Flooring', 'Marble', '2025-09-03', '2025-09-03', ''],
            ['Flooring', 'Porcelain', '2025-09-03', '2025-09-03', ''],
            ['Flooring', 'Tiles Carpet', '2025-09-03', '2025-09-03', ''],
            ['Flooring', 'Custom Carpets', '2025-09-03', '2025-09-03', ''],
            ['Wall Finishes', 'Wooden Cladding', '2025-09-03', '2025-09-03', ''],
            ['Wall Finishes', 'Wall Paint', '2025-09-03', '2025-09-03', ''],
            ['Wall Finishes', 'MCM Stones', '2025-09-03', '2025-09-03', ''],
            ['Partitions', 'Gypsum Partition', '2025-09-03', '2025-09-03', ''],
            ['Partitions', 'Glass Partition', '2025-09-03', '2025-09-03', ''],
            ['Doors', 'Doors', '2025-09-03', '2025-09-03', ''],
            ['Sanitary', 'Sanitary', '2025-09-03', '2025-09-03', ''],
            ['Paint', 'Ceiling Paint', '2025-09-03', '2025-09-03', ''],
            ['PA', 'Screens & PA Systems', '2025-09-03', '2025-09-03', ''],
            ['Furniture', 'Customized Furniture', '2025-09-03', '2025-09-03', ''],
            ['Furniture', 'Furniture', '2025-09-03', '2025-09-03', ''],
            ['Planters', 'Planters', '2025-09-03', '2025-09-03', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Main Activity', 'Activity/Item', 'Material Submittal Date', 'Procurement Status', 'Remarks'],
          rows: [
            ['Flooring', 'Marble', '2025-09-03', '🟡 Pending', ''],
            ['Flooring', 'Porcelain', '2025-09-03', '🟡 Pending', ''],
            ['Flooring', 'Tiles Carpet', '2025-09-03', '🟡 Pending', ''],
            ['Flooring', 'Custom Carpets', '2025-09-03', '🟡 Pending', ''],
            ['Wall Finishes', 'Wooden Cladding', '2025-09-03', '🟡 Pending', ''],
            ['Wall Finishes', 'Wall Paint', '2025-09-03', '🟡 Pending', ''],
            ['Wall Finishes', 'MCM Stones', '2025-09-03', '🟡 Pending', ''],
            ['Partitions', 'Gypsum Partition', '2025-09-03', '🟡 Pending', ''],
            ['Partitions', 'Glass Partition', '2025-09-03', '🟡 Pending', ''],
            ['Doors', 'Doors', '2025-09-03', '🟡 Pending', ''],
            ['Sanitary', 'Sanitary', '2025-09-03', '🟡 Pending', ''],
            ['Paint', 'Ceiling Paint', '2025-09-03', '🟡 Pending', ''],
            ['PA', 'Screens & PA Systems', '2025-09-03', '🟡 Pending', ''],
            ['Furniture', 'Customized Furniture', '2025-09-03', '🟡 Pending', ''],
            ['Furniture', 'Furniture', '2025-09-03', '🟡 Pending', ''],
            ['Planters', 'Planters', '2025-09-03', '🟡 Pending', ''],
          ],
        },
        {
          title: 'Execution',
          headers: ['Main Activity', 'Activity/Item', 'Execution Start Date', 'Execution Finish Date', 'Remarks'],
          rows: [
            ['Flooring', 'Marble', '2025-09-03', '2025-09-03', ''],
            ['Flooring', 'Porcelain', '2025-09-03', '2025-09-03', ''],
            ['Flooring', 'Tiles Carpet', '2025-09-03', '2025-09-03', ''],
            ['Flooring', 'Custom Carpets', '2025-09-03', '2025-09-03', ''],
            ['Wall Finishes', 'Wooden Cladding', '2025-09-03', '2025-09-03', ''],
            ['Wall Finishes', 'Wall Paint', '2025-09-03', '2025-09-03', ''],
            ['Wall Finishes', 'MCM Stones', '2025-09-03', '2025-09-03', ''],
            ['Partitions', 'Gypsum Partition', '2025-09-03', '2025-09-03', ''],
            ['Partitions', 'Glass Partition', '2025-09-03', '2025-09-03', ''],
            ['Doors', 'Doors', '2025-09-03', '2025-09-03', ''],
            ['Sanitary', 'Sanitary', '2025-09-03', '2025-09-03', ''],
            ['Paint', 'Ceiling Paint', '2025-09-03', '2025-09-03', ''],
            ['PA', 'Screens & PA Systems', '2025-09-03', '2025-09-03', ''],
            ['Furniture', 'Customized Furniture', '2025-09-03', '2025-09-03', ''],
            ['Furniture', 'Furniture', '2025-09-03', '2025-09-03', ''],
            ['Planters', 'Planters', '2025-09-03', '2025-09-03', ''],
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
