'use client';

import { useState, useMemo } from 'react';
import type { ExtractTablesOutput } from '@/ai/flows/extract-and-display-tables';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditableCell } from './editable-cell';
import { DatePickerCell } from './date-picker-cell';
import { StatusDropdownCell } from './status-dropdown-cell';
import { Download, ChevronsUpDown, RotateCcw, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

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

const getDefaultHiddenColumns = (tables: TableData[]): Record<number, Set<string>> => {
  const hidden: Record<number, Set<string>> = {};

  tables.forEach((table, index) => {
    hidden[index] = new Set<string>();
    const title = tableTitles[index];
    
    // Function to check if a header should be hidden
    const shouldHide = (header: string): boolean => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes("activity")) {
        return false;
      }

      if (title === "Engineering") {
        return !lowerHeader.includes("shop drawing");
      }
      if (title === "Procurement") {
        return lowerHeader !== "procurement status";
      }
      if (title === "Execution") {
        return !lowerHeader.includes("start") && !lowerHeader.includes("finish");
      }
      return true; // Hide by default if no specific rule matches
    };

    table.headers.forEach(header => {
      if (shouldHide(header)) {
        hidden[index].add(header);
      }
    });
  });

  return hidden;
};

const initializeTableData = (tables: TableData[]): TableData[] => {
  const today = format(new Date(), 'yyyy-MM-dd');

  return tables.map((table, tableIndex) => {
    const title = tableTitles[tableIndex];
    if (title === "Engineering" || title === "Execution") {
      const dateColumnIndices = table.headers
        .map((h, i) => (h.toLowerCase().includes('date') ? i : -1))
        .filter(i => i !== -1);
      
      if (dateColumnIndices.length > 0) {
        const newRows = table.rows.map(row => {
          const newRow = [...row];
          dateColumnIndices.forEach(index => {
            if (!newRow[index]) {
              newRow[index] = today;
            }
          });
          return newRow;
        });
        return { ...table, rows: newRows };
      }
    }
    return table;
  });
};


export function TableViewer({ initialData, onReset, fileName }: TableViewerProps) {
  const [editedData, setEditedData] = useState<TableData[]>(() => initializeTableData(initialData.tables));
  const [hiddenColumns, setHiddenColumns] = useState<Record<number, Set<string>>>(() => getDefaultHiddenColumns(initialData.tables));

  const handleCellChange = (tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    setEditedData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
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
      const newSet = new Set(newHidden[tableIndex]);
      if (newSet.has(header)) {
        newSet.delete(header);
      } else {
        newSet.add(header);
      }
      newHidden[tableIndex] = newSet;
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
      const originalHeaders = table.headers;
      const visibleHeaders = originalHeaders.filter(h => !hidden.has(h));
      const headerIndexMap: Record<string, number> = {};
      originalHeaders.forEach((h, i) => {
        headerIndexMap[h] = i;
      });
      return {
        originalHeaders: originalHeaders,
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
        {visibleTables.map((table, tableIndex) => {
          const tableTitle = tableTitles[tableIndex] || `Table ${tableIndex + 1}`;
          
          return (
            <div key={`table-container-${tableIndex}`} className="p-4 border rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-lg font-semibold">{tableTitle}</h3>
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
                        {table.headers.map((header) => {
                          const colIndex = table.headerIndexMap[header];
                          const cellValue = row[colIndex];
                          const lowerHeader = header.toLowerCase();

                          if ((tableTitle === "Engineering" || tableTitle === "Execution") && lowerHeader.includes('date')) {
                            return (
                              <DatePickerCell
                                key={`cell-${tableIndex}-${rowIndex}-${colIndex}`}
                                value={cellValue}
                                onValueChange={(newValue) => {
                                  handleCellChange(tableIndex, rowIndex, colIndex, newValue)
                                }}
                              />
                            )
                          }

                          if (tableTitle === "Procurement" && lowerHeader === 'procurement status') {
                             return (
                                <StatusDropdownCell
                                  key={`cell-${tableIndex}-${rowIndex}-${colIndex}`}
                                  value={cellValue}
                                  onValueChange={(newValue) => {
                                    handleCellChange(tableIndex, rowIndex, colIndex, newValue)
                                  }}
                                />
                             )
                          }

                          return (
                           <EditableCell
                            key={`cell-${tableIndex}-${rowIndex}-${colIndex}`}
                            value={cellValue}
                            onValueChange={(newValue) => {
                              handleCellChange(tableIndex, rowIndex, colIndex, newValue)
                            }}
                          />
                        )})}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
