'use client';

import { useState, useRef, type DragEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileProcess: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function FileUploader({ onFileProcess, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileProcess(files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Upload Your File</CardTitle>
        <CardDescription>Extract tables from Excel (.xlsx) and PDF files.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300",
            isDragging ? "border-primary bg-accent/10" : "border-border hover:border-primary/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={isLoading}
          />
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Analyzing your file...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
              <FileUp className="h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-muted-foreground">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">Supports: .xlsx, .pdf</p>
            </div>
          )}
        </div>
        <Button 
            className="w-full mt-6 bg-accent hover:bg-accent/90"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            size="lg"
        >
            Select File
        </Button>
      </CardContent>
    </Card>
  );
}
