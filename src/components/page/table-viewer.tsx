'use client';

import { useState, useMemo } from 'react';
import type { ExtractTablesOutput } from '@/ai/flows/extract-and-display-tables';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditableCell } from './editable-cell';
import { Download, ChevronsUpDown, RotateCcw, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TableViewerProps {
  initialData: ExtractTablesOutput;
  onReset: () => void;
  fileName: string;
}

type TableData = {
  headers: string[];
  rows: string[][];
};

export function TableViewer({ initialData, onReset, fileName }: TableViewerProps) {
  const [editedData, setEditedData] = useState<TableData[]>(initialData.tables);
  const [hiddenColumns, setHiddenColumns] = useState<Record<number, Set<string>>>({});

  const handleCellChange = (tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    setEditedData(prevData => {
      const newData = [...prevData];
      newData[tableIndex].rows[rowIndex][colIndex] = value;
      return newData;
    });
  };

  const handleColumnToggle = (tableIndex: number, header: string) => {
    setHiddenColumns(prev => {
      const newHidden = { ...prev };
      if (!newHidden[tableIndex]) {
        newHidden[tableIndex] = new Set();
      }
      if (newHidden[tableIndex].has(header)) {
        newHidden[tableIndex].delete(header);
      } else {
        newHidden[tableIndex].add(header);
      }
      return newHidden;
    });
  };
  
  const downloadAsCsv = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadCsv = (tableIndex: number) => {
    const table = editedData[tableIndex];
    const hidden = hiddenColumns[tableIndex] || new Set();

    const visibleHeaders = table.headers.filter(h => !hidden.has(h));
    const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
    
    const visibleRows = table.rows.map(row => 
      visibleHeaderIndices.map(index => row[index])
    );

    const cleanFileName = fileName.substring(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadAsCsv(`${cleanFileName}_table_${tableIndex + 1}.csv`, visibleHeaders, visibleRows);
  };

  const handleDownloadPdf = (tableIndex: number) => {
    const table = editedData[tableIndex];
    const hidden = hiddenColumns[tableIndex] || new Set();
    const cleanFileName = fileName.substring(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    const doc = new jsPDF();
    
    const visibleHeaders = table.headers.filter(h => !hidden.has(h));
    const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
    const visibleRows = table.rows.map(row => 
      visibleHeaderIndices.map(index => row[index])
    );

    (doc as any).autoTable({
        head: [visibleHeaders],
        body: visibleRows,
        didDrawPage: function (data: any) {
            doc.setFontSize(20);
            doc.text(`Table ${tableIndex + 1} from ${fileName}`, data.settings.margin.left, 15);
        }
    });
    
    doc.save(`${cleanFileName}_table_${tableIndex + 1}.pdf`);
  };
  
  const visibleTables = useMemo(() => {
    return editedData.map((table, tableIndex) => {
      const hidden = hiddenColumns[tableIndex] || new Set();
      const visibleHeaders = table.headers.filter(h => !hidden.has(h));
      const headerIndexMap = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
      
      return {
        originalHeaders: table.headers,
        headers: visibleHeaders,
        rows: table.rows,
        headerIndexMap,
      };
    });
  }, [editedData, hiddenColumns]);

  if (editedData.length === 0) {
      return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>No Micro Level Program Found</CardTitle>
                <CardDescription>We couldn't detect any structured tables in '{fileName}'. Please try another file.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={onReset} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Upload Another File
                </Button>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <CardTitle className="text-3xl">Micro Level Program</CardTitle>
                <CardDescription>Generated Micro Level Program from '{fileName}'. You can edit the data below.</CardDescription>
            </div>
            <Button onClick={onReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table-0">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {editedData.map((_, i) => (
              <TabsTrigger key={`trigger-${i}`} value={`table-${i}`}>Table {i + 1}</TabsTrigger>
            ))}
          </TabsList>
          {visibleTables.map((table, tableIndex) => (
            <TabsContent key={`content-${tableIndex}`} value={`table-${tableIndex}`}>
              <div className="mt-4 p-4 border rounded-lg">
                 <div className="flex justify-end mb-4 gap-2 flex-wrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <ChevronsUpDown className="mr-2 h-4 w-4" />
                          Show/Hide Columns
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {table.originalHeaders.map(header => (
                          <DropdownMenuCheckboxItem
                            key={header}
                            checked={!hiddenColumns[tableIndex]?.has(header)}
                            onCheckedChange={() => handleColumnToggle(tableIndex, header)}
                          >
                            {header}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={() => handleDownloadPdf(tableIndex)} variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Download as PDF
                    </Button>
                    <Button onClick={() => handleDownloadCsv(tableIndex)} className="bg-accent hover:bg-accent/90">
                      <Download className="mr-2 h-4 w-4" />
                      Download as CSV
                    </Button>
                </div>
                <div className="overflow-x-auto relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {table.headers.map((header, i) => (
                          <TableHead key={`head-${i}`}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {table.rows.map((row, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                          {table.headerIndexMap.map((colIndex, i) => (
                            <EditableCell
                              key={`cell-${rowIndex}-${i}`}
                              value={row[colIndex]}
                              onValueChange={(newValue) => handleCellChange(tableIndex, rowIndex, colIndex, newValue)}
                            />
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
