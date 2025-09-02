'use client';

import { useState, useMemo } from 'react';
import type { ExtractTablesOutput } from '@/ai/flows/extract-and-display-tables';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const tableTitles = ["Engineering", "Procurement", "Execution"];

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
  
  const getCleanFileName = () => fileName.substring(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const downloadAllAsCsv = () => {
    let csvContent = '';
    
    editedData.forEach((table, tableIndex) => {
      const hidden = hiddenColumns[tableIndex] || new Set();
  
      const visibleHeaders = table.headers.filter(h => !hidden.has(h));
      const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
      
      const visibleRows = table.rows.map(row => 
        visibleHeaderIndices.map(index => row[index])
      );

      csvContent += `${tableTitles[tableIndex] || `Table ${tableIndex + 1}`}\n`;
      csvContent += visibleHeaders.join(',') + '\n';
      csvContent += visibleRows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n') + '\n\n';
    });
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${getCleanFileName()}_all_tables.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsPdf = () => {
    const doc = new jsPDF();
    const cleanFileName = getCleanFileName();
    
    doc.setFontSize(20);
    doc.text(`Tables from ${fileName}`, (doc.internal.pageSize.getWidth() / 2), 15, { align: 'center' });

    editedData.forEach((table, tableIndex) => {
      if (tableIndex > 0) {
        doc.addPage();
      }
      const hidden = hiddenColumns[tableIndex] || new Set();
      const visibleHeaders = table.headers.filter(h => !hidden.has(h));
      const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
      const visibleRows = table.rows.map(row => 
        visibleHeaderIndices.map(index => row[index])
      );

      (doc as any).autoTable({
          head: [visibleHeaders],
          body: visibleRows,
          startY: 30,
          didDrawPage: function (data: any) {
              doc.setFontSize(16);
              doc.text(tableTitles[tableIndex] || `Table ${tableIndex + 1}`, data.settings.margin.left, 25);
          }
      });
    });
    
    doc.save(`${getCleanFileName()}_all_tables.pdf`);
  };
  
  const visibleTables = useMemo(() => {
    return editedData.map((table, tableIndex) => {
      const hidden = hiddenColumns[tableIndex] || new Set();
      const visibleHeaders = table.headers.filter(h => !hidden.has(h));
      const headerIndexMap = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
      
      const visibleRows = table.rows.map(row => {
          return headerIndexMap.map(index => row[index]);
      });

      return {
        originalHeaders: table.headers,
        headers: visibleHeaders,
        rows: table.rows, // pass original rows
        headerIndexMap, // and the map
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
            <div className="flex flex-wrap gap-2">
              <Button onClick={onReset} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
              </Button>
              <Button onClick={downloadAllAsPdf} variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Download as PDF
              </Button>
              <Button onClick={downloadAllAsCsv} className="bg-accent hover:bg-accent/90">
                <Download className="mr-2 h-4 w-4" />
                Download as CSV
              </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {visibleTables.map((table, tableIndex) => (
          <div key={`table-container-${tableIndex}`} className="p-4 border rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-semibold">{tableTitles[tableIndex] || `Table ${tableIndex + 1}`}</h3>
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
              </div>
            <div className="overflow-x-auto relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    {table.headers.map((header, i) => (
                      <TableHead key={`head-${tableIndex}-${i}`}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.rows.map((row, rowIndex) => (
                    <TableRow key={`row-${tableIndex}-${rowIndex}`}>
                      {table.headerIndexMap.map((originalColIndex, visibleColIndex) => (
                        <EditableCell
                          key={`cell-${tableIndex}-${rowIndex}-${visibleColIndex}`}
                          value={row[originalColIndex]}
                          onValueChange={(newValue) => handleCellChange(tableIndex, rowIndex, originalColIndex, newValue)}
                        />
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
