'use client';

import { useState, useEffect } from 'react';
import type { ExtractTablesOutput } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditableCell } from './editable-cell';
import { DatePickerCell } from './date-picker-cell';
import { StatusDropdownCell } from './status-dropdown-cell';
import { Download, ChevronsUpDown, RotateCcw, FileText, Trash2, PlusCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { Input } from '../ui/input';

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
        if (lowerHeader.includes("activity/item")) {
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
  return locations.map(loc => ({
    ...loc,
    tables: loc.tables.map(table => ({...table}))
  }));
};


export function TableViewer({ initialData, onReset, fileName }: TableViewerProps) {
  const [editedData, setEditedData] = useState<LocationData[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, Record<string, Set<string>>>>({});
  const [editedLocations, setEditedLocations] = useState<string[]>([]);
  
  useEffect(() => {
    const dataWithDates = initialData.locations.map(loc => ({
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
                    // Only set a default date if the cell is empty
                    if (!newRow[index]) {
                      const today = new Date();
                      newRow[index] = format(today, 'yyyy-MM-dd');
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

    setEditedData(initializeTableData(dataWithDates));
    setHiddenColumns(getDefaultHiddenColumns(initialData.locations));
    setEditedLocations(initialData.locations.map(l => l.location));
  }, [initialData]);


  const handleLocationChange = (newLocation: string, index: number) => {
    setEditedLocations(prevLocations => {
      const newLocations = [...prevLocations];
      newLocations[index] = newLocation;
      return newLocations;
    });
  };

  const handleCellChange = (locIndex: number, tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    setEditedData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const originalTableTitle = tableTitlesOrder[tableIndex];
      const actualTableIndex = newData[locIndex].tables.findIndex(t => t.title === originalTableTitle);
      
      if(actualTableIndex !== -1) {
        newData[locIndex].tables[actualTableIndex].rows[rowIndex][colIndex] = value;
      }
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
  
  const handleAddRow = (locIndex: number, tableTitle: string) => {
    setEditedData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const tableIndex = newData[locIndex].tables.findIndex(t => t.title === tableTitle);
      if (tableIndex === -1) return prevData;

      const table = newData[locIndex].tables[tableIndex];
      const newRow = Array(table.headers.length).fill('');
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const lowerTitle = table.title.toLowerCase();
      if (lowerTitle === "engineering" || lowerTitle === "execution") {
        table.headers.forEach((header, index) => {
          if (header.toLowerCase().includes('date')) {
            newRow[index] = today;
          }
        });
      }
       if (lowerTitle === "procurement") {
        table.headers.forEach((header, index) => {
          if (header.toLowerCase().includes('status')) {
            newRow[index] = '🟡 Pending';
          }
        });
      }
      
      table.rows.push(newRow);
      return newData;
    });
  };

  const handleDeleteRow = (locIndex: number, tableTitle: string, rowIndex: number) => {
    setEditedData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const tableIndex = newData[locIndex].tables.findIndex(t => t.title === tableTitle);
      if (tableIndex === -1) return prevData;
      
      newData[locIndex].tables[tableIndex].rows.splice(rowIndex, 1);
      return newData;
    });
  };

  const getCleanFileName = () => fileName.substring(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const downloadAllAsCsv = () => {
    let csvContent = '';
    
    editedData.forEach((loc, locIndex) => {
      const originalLocation = initialData.locations[locIndex].location;
      csvContent += `Location: ${editedLocations[locIndex]}\n\n`;

      loc.tables.forEach(table => {
        const hidden = hiddenColumns[originalLocation]?.[table.title] || new Set();
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

  const downloadAllAsPdf = async () => {
    const doc = new jsPDF();
    const cleanFileName = getCleanFileName();
    
    let startY = 15;

    doc.setFont('helvetica', 'bold');

    editedData.forEach((loc, locIndex) => {
        const originalLocation = initialData.locations[locIndex];

        doc.setFontSize(20);
        doc.text(`Location: ${editedLocations[locIndex]}`, (doc.internal.pageSize.getWidth() / 2), startY, { align: 'center' });
        startY += 15;

        loc.tables
          .sort((a, b) => tableTitlesOrder.indexOf(a.title) - tableTitlesOrder.indexOf(b.title))
          .forEach((table) => {
              if (startY + 20 > doc.internal.pageSize.getHeight()) {
                  doc.addPage();
                  startY = 15;
              }

              const hidden = hiddenColumns[originalLocation.location]?.[table.title] || new Set();
              const visibleHeaders = table.headers.filter(h => !hidden.has(h));
              const visibleHeaderIndices = table.headers.map((h, i) => hidden.has(h) ? -1 : i).filter(i => i !== -1);
              const visibleRows = table.rows.map(row => visibleHeaderIndices.map(index => String(row[index] || '')));
              
              doc.setFontSize(16);
              doc.text(table.title, 14, startY);
              startY += 7;

              (doc as any).autoTable({
                  head: [visibleHeaders],
                  body: visibleRows,
                  startY: startY,
                  willDrawCell: function (data: any) {
                    const isProcurementStatusColumn = table.title.toLowerCase() === 'procurement' && data.column.dataKey === visibleHeaders.length - 1;
                    if (isProcurementStatusColumn) {
                      data.cell.styles.fontStyle = 'bold';
                      data.cell.text = ''; 
                    }
                  },
                  didDrawCell: function (data: any) {
                    const isProcurementStatusColumn = table.title.toLowerCase() === 'procurement' && data.column.dataKey === visibleHeaders.length - 1;
                    if (isProcurementStatusColumn && data.cell.raw) {
                      const rawText = String(data.cell.raw);
                      const cellText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

                      let textColor = '#000000'; // Default black

                      if (cellText.includes('Completed')) {
                          textColor = '#28a745'; // Green
                      } else if (cellText.includes('Pending')) {
                          textColor = '#ffc107'; // Yellow
                      } else if (cellText.includes('In Progress')) {
                          textColor = '#fd7e14'; // Orange
                      } else if (cellText.includes('Delayed')) {
                          textColor = '#dc3545'; // Red
                      }
                      
                      doc.setTextColor(textColor);
                      doc.setFont('helvetica', 'bold');
                      doc.text(cellText, data.cell.x + data.cell.padding('left'), data.cell.y + data.cell.height / 2, {
                        baseline: 'middle'
                      });
                    }
                  },
              });

              startY = (doc as any).lastAutoTable.finalY + 15;
        });
    });
    
    doc.save(`${getCleanFileName()}_all_tables.pdf`);
  };
  
  if (editedData.length === 0) {
      return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>No Micro Level Program Found</CardTitle>
                <CardDescription>There is no data to display.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={onReset} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Data
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
                  Reset Data
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
        {editedData.map((loc, locIndex) => {
          const originalLocation = initialData.locations[locIndex];
          return (
            <Card key={`loc-${locIndex}`} className="p-4 border rounded-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">Location / Area / Zone:</span>
                  <Input
                      type="text"
                      defaultValue={editedLocations[locIndex]}
                      onBlur={(e) => handleLocationChange(e.target.value, locIndex)}
                      className="text-xl font-semibold border-0 border-b-2 rounded-none shadow-none focus-visible:ring-0 focus:border-primary"
                    />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loc.tables
                  .sort((a, b) => tableTitlesOrder.indexOf(a.title) - tableTitlesOrder.indexOf(b.title))
                  .map((table, tableOrderIndex) => {
                    const hidden = hiddenColumns[originalLocation.location]?.[table.title] || new Set();
                    const visibleHeaders = table.headers.filter(h => !hidden.has(h));
                    const headerIndexMap: Record<string, number> = {};
                    table.headers.forEach((h, i) => {
                        headerIndexMap[h] = i;
                    });
                    
                    return (
                      <div key={`table-container-${locIndex}-${table.title}`} className="p-4 border rounded-lg">
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
                                    onCheckedChange={() => handleColumnToggle(originalLocation.location, table.title, header)}
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
                                  <TableHead key={`head-${locIndex}-${table.title}-${i}`}>{header}</TableHead>
                                ))}
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {table.rows.map((row, rowIndex) => (
                                <TableRow key={`row-${locIndex}-${table.title}-${rowIndex}`}>
                                  {visibleHeaders.map((header) => {
                                    const colIndex = headerIndexMap[header];
                                    const cellValue = row[colIndex];
                                    const lowerHeader = header.toLowerCase();
                                    const lowerTableTitle = table.title.toLowerCase();

                                    if ((lowerTableTitle === "engineering" || lowerTableTitle === "execution") && lowerHeader.includes('date')) {
                                      return (
                                        <DatePickerCell
                                          key={`cell-${locIndex}-${table.title}-${rowIndex}-${colIndex}`}
                                          value={cellValue}
                                          onValueChange={(newValue) => {
                                            handleCellChange(locIndex, tableOrderIndex, rowIndex, colIndex, newValue)
                                          }}
                                        />
                                      )
                                    }

                                    if (lowerTableTitle === "procurement" && lowerHeader.includes('status')) {
                                       return (
                                          <StatusDropdownCell
                                            key={`cell-${locIndex}-${table.title}-${rowIndex}-${colIndex}`}
                                            value={cellValue}
                                            onValueChange={(newValue) => {
                                              handleCellChange(locIndex, tableOrderIndex, rowIndex, colIndex, newValue)
                                            }}
                                          />
                                       )
                                    }

                                    return (
                                     <EditableCell
                                      key={`cell-${locIndex}-${table.title}-${rowIndex}-${colIndex}`}
                                      value={cellValue}
                                      onValueChange={(newValue) => {
                                        handleCellChange(locIndex, tableOrderIndex, rowIndex, colIndex, newValue)
                                      }}
                                    />
                                  )})}
                                  <TableCell>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(locIndex, table.title, rowIndex)}>
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                         <div className="flex justify-end mt-4">
                              <Button variant="outline" onClick={() => handleAddRow(locIndex, table.title)}>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Row
                              </Button>
                          </div>
                      </div>
                    )
                })}
              </CardContent>
            </Card>
          )
})}
      </CardContent>
    </Card>
  );
}

    