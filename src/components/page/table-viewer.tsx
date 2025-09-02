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
  title: string;
  headers: string[];
  rows: string[][];
};

type LocationData = {
    location: string;
    tables: TableData[];
}

const tableTitlesOrder = ["Engineering", "Procurement", "Execution"];


const getDefaultHiddenColumns = (locations: LocationData[]): Record<string, Record<string, Set<string>>> => {
  const hidden: Record<string, Record<string, Set<string>>> = {};

  locations.forEach(loc => {
    hidden[loc.location] = {};
    loc.tables.forEach(table => {
      hidden[loc.location][table.title] = new Set<string>();
      
      const shouldHide = (header: string): boolean => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes("activity")) {
          return false;
        }
        
        const lowerTitle = table.title.toLowerCase();

        if (lowerTitle === "engineering") {
          return !lowerHeader.includes("shop drawing");
        }
        if (lowerTitle === "procurement") {
          return lowerHeader !== "procurement status";
        }
        if (lowerTitle === "execution") {
          return !lowerHeader.includes("start") && !lowerHeader.includes("finish");
        }
        return true; 
      };

      table.headers.forEach(header => {
        if (shouldHide(header)) {
          hidden[loc.location][table.title].add(header);
        }
      });
    });
  });

  return hidden;
};

const initializeTableData = (locations: LocationData[]): LocationData[] => {
  const today = format(new Date(), 'yyyy-MM-dd');

  return locations.map(loc => ({
    ...loc,
    tables: loc.tables.map(table => {
        const lowerTitle = table.title.toLowerCase();
        if (lowerTitle === "engineering" || lowerTitle === "execution") {
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
    })
  }));
};


export function TableViewer({ initialData, onReset, fileName }: TableViewerProps) {
  const [editedData, setEditedData] = useState<LocationData[]>(() => initializeTableData(initialData.locations));
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, Record<string, Set<string>>>>(() => getDefaultHiddenColumns(initialData.locations));

  const handleCellChange = (locIndex: number, tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    setEditedData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      newData[locIndex].tables[tableIndex].rows[rowIndex][colIndex] = value;
      return newData;
    });
  };

  const handleColumnToggle = (location: string, tableTitle: string, header: string) => {
    setHiddenColumns(prev => {
      const newHidden = { ...prev };
      if (!newHidden[location]) newHidden[location] = {};
      if (!newHidden[location][tableTitle]) newHidden[location][tableTitle] = new Set();
      
      const newSet = new Set(newHidden[location][tableTitle]);
      if (newSet.has(header)) {
        newSet.delete(header);
      } else {
        newSet.add(header);
      }
      newHidden[location][tableTitle] = newSet;
      return newHidden;
    });
  };
  
  const getCleanFileName = () => fileName.substring(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const downloadAllAsCsv = () => {
    let csvContent = '';
    
    editedData.forEach((loc) => {
      csvContent += `Location: ${loc.location}\n\n`;
      loc.tables.forEach(table => {
        const hidden = hiddenColumns[loc.location]?.[table.title] || new Set();
        const visibleHeaders = table.headers.filter(h => !hidden.has(h));
        const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
        const visibleRows = table.rows.map(row => visibleHeaderIndices.map(index => row[index]));

        csvContent += `${table.title}\n`;
        csvContent += visibleHeaders.join(',') + '\n';
        csvContent += visibleRows.map(row => 
          row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n') + '\n\n';
      });
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
    let startY = 15;

    editedData.forEach((loc, locIndex) => {

      doc.setFontSize(20);
      doc.text(`Location: ${loc.location}`, (doc.internal.pageSize.getWidth() / 2), startY, { align: 'center' });
      startY += 15;

      loc.tables.forEach((table) => {
        const hidden = hiddenColumns[loc.location]?.[table.title] || new Set();
        const visibleHeaders = table.headers.filter(h => !hidden.has(h));
        const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
        const visibleRows = table.rows.map(row => visibleHeaderIndices.map(index => String(row[index])));
        
        doc.setFontSize(16);
        doc.text(table.title, 14, startY);
        startY += 5;

        (doc as any).autoTable({
            head: [visibleHeaders],
            body: visibleRows,
            startY: startY,
        });

        startY = (doc as any).lastAutoTable.finalY + 10;
      });
    });
    
    doc.save(`${cleanFileName}_all_tables.pdf`);
  };
  
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
        {editedData.map((loc, locIndex) => (
          <Card key={`loc-${locIndex}`} className="p-4 border rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl">Location / Area / Zone: {loc.location}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loc.tables
                .sort((a, b) => tableTitlesOrder.indexOf(a.title) - tableTitlesOrder.indexOf(b.title))
                .map((table, tableIndex) => {
                  const hidden = hiddenColumns[loc.location]?.[table.title] || new Set();
                  const visibleHeaders = table.headers.filter(h => !hidden.has(h));
                  const headerIndexMap: Record<string, number> = {};
                  table.headers.forEach((h, i) => {
                      headerIndexMap[h] = i;
                  });

                  return (
                    <div key={`table-container-${locIndex}-${tableIndex}`} className="p-4 border rounded-lg">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <h3 className="text-lg font-semibold">{table.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                <ChevronsUpDown className="mr-2 h-4 w-4" />
                                Show/Hide Columns
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {table.headers.map(header => (
                                <DropdownMenuCheckboxItem
                                  key={header}
                                  checked={!hidden.has(header)}
                                  onCheckedChange={() => handleColumnToggle(loc.location, table.title, header)}
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
                              {visibleHeaders.map((header, i) => (
                                <TableHead key={`head-${locIndex}-${tableIndex}-${i}`}>{header}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.rows.map((row, rowIndex) => (
                              <TableRow key={`row-${locIndex}-${tableIndex}-${rowIndex}`}>
                                {visibleHeaders.map((header) => {
                                  const colIndex = headerIndexMap[header];
                                  const cellValue = row[colIndex];
                                  const lowerHeader = header.toLowerCase();
                                  const lowerTableTitle = table.title.toLowerCase();

                                  if ((lowerTableTitle === "engineering" || lowerTableTitle === "execution") && lowerHeader.includes('date')) {
                                    return (
                                      <DatePickerCell
                                        key={`cell-${locIndex}-${tableIndex}-${rowIndex}-${colIndex}`}
                                        value={cellValue}
                                        onValueChange={(newValue) => {
                                          handleCellChange(locIndex, tableIndex, rowIndex, colIndex, newValue)
                                        }}
                                      />
                                    )
                                  }

                                  if (lowerTableTitle === "procurement" && lowerHeader === 'procurement status') {
                                     return (
                                        <StatusDropdownCell
                                          key={`cell-${locIndex}-${tableIndex}-${rowIndex}-${colIndex}`}
                                          value={cellValue}
                                          onValueChange={(newValue) => {
                                            handleCellChange(locIndex, tableIndex, rowIndex, colIndex, newValue)
                                          }}
                                        />
                                     )
                                  }

                                  return (
                                   <EditableCell
                                    key={`cell-${locIndex}-${tableIndex}-${rowIndex}-${colIndex}`}
                                    value={cellValue}
                                    onValueChange={(newValue) => {
                                      handleCellChange(locIndex, tableIndex, rowIndex, colIndex, newValue)
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
        ))}
      </CardContent>
    </Card>
  );
}
