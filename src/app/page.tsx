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
            ['Flooring', 'Marble', '', '', ''],
            ['Flooring', 'Porcelain', '', '', ''],
            ['Flooring', 'Tiles Carpet', '', '', ''],
            ['Flooring', 'Custom Carpets', '', '', ''],
            ['Wall Finishes', 'Wooden Cladding', '', '', ''],
            ['Wall Finishes', 'Wall Paint', '', '', ''],
            ['Wall Finishes', 'MCM Stones', '', '', ''],
            ['Partitions', 'Gypsum Partition', '', '', ''],
            ['Partitions', 'Glass Partition', '', '', ''],
            ['Doors', 'Doors', '', '', ''],
            ['Sanitary', 'Sanitary', '', '', ''],
            ['Paint', 'Ceiling Paint', '', '', ''],
            ['PA', 'Screens & PA Systems', '', '', ''],
            ['Furniture', 'Customized Furniture', '', '', ''],
            ['Furniture', 'Furniture', '', '', ''],
            ['Planters', 'Planters', '', '', ''],
          ],
        },
        {
          title: 'Procurement',
          headers: ['Main Activity', 'Activity/Item', 'Material Submittal Date', 'Procurement Status', 'Remarks'],
          rows: [
            ['Flooring', 'Marble', '', '🟡 Pending', ''],
            ['Flooring', 'Porcelain', '', '🟡 Pending', ''],
            ['Flooring', 'Tiles Carpet', '', '🟡 Pending', ''],
            ['Flooring', 'Custom Carpets', '', '🟡 Pending', ''],
            ['Wall Finishes', 'Wooden Cladding', '', '🟡 Pending', ''],
            ['Wall Finishes', 'Wall Paint', '', '🟡 Pending', ''],
            ['Wall Finishes', 'MCM Stones', '', '🟡 Pending', ''],
            ['Partitions', 'Gypsum Partition', '', '🟡 Pending', ''],
            ['Partitions', 'Glass Partition', '', '🟡 Pending', ''],
            ['Doors', 'Doors', '', '🟡 Pending', ''],
            ['Sanitary', 'Sanitary', '', '🟡 Pending', ''],
            ['Paint', 'Ceiling Paint', '', '🟡 Pending', ''],
            ['PA', 'Screens & PA Systems', '', '🟡 Pending', ''],
            ['Furniture', 'Customized Furniture', '', '🟡 Pending', ''],
            ['Furniture', 'Furniture', '', '🟡 Pending', ''],
            ['Planters', 'Planters', '', '🟡 Pending', ''],
          ],
        },
        {
          title: 'Execution',
          headers: ['Main Activity', 'Activity/Item', 'Execution Start Date', 'Execution Finish Date', 'Remarks'],
          rows: [
            ['Flooring', 'Marble', '', '', ''],
            ['Flooring', 'Porcelain', '', '', ''],
            ['Flooring', 'Tiles Carpet', '', '', ''],
            ['Flooring', 'Custom Carpets', '', '', ''],
            ['Wall Finishes', 'Wooden Cladding', '', '', ''],
            ['Wall Finishes', 'Wall Paint', '', '', ''],
            ['Wall Finishes', 'MCM Stones', '', '', ''],
            ['Partitions', 'Gypsum Partition', '', '', ''],
            ['Partitions', 'Glass Partition', '', '', ''],
            ['Doors', 'Doors', '', '', ''],
            ['Sanitary', 'Sanitary', '', '', ''],
            ['Paint', 'Ceiling Paint', '', '', ''],
            ['PA', 'Screens & PA Systems', '', '', ''],
            ['Furniture', 'Customized Furniture', '', '', ''],
            ['Furniture', 'Furniture', '', '', ''],
            ['Planters', 'Planters', '', '', ''],
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
