'use client';

import { useState } from 'react';
import type { ExtractTablesOutput } from '@/ai/flows/extract-and-display-tables';
import { useToast } from '@/hooks/use-toast';
import { extractTables as extractTablesAction } from '@/app/actions';

import { LogoIcon } from '@/components/icons';
import { FileUploader } from '@/components/page/file-uploader';
import { TableViewer } from '@/components/page/table-viewer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractTablesOutput | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileProcess = async (file: File) => {
    setIsLoading(true);
    setExtractedData(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const fileDataUri = reader.result as string;
        const fileType = file.type.includes('pdf') ? 'pdf' : 'excel';
        
        if (!fileDataUri) {
          throw new Error('Could not read file.');
        }

        const result = await extractTablesAction({ fileDataUri, fileType });
        
        if (result.success && result.data) {
          if (result.data.locations.length === 0) {
             toast({
              variant: "default",
              title: "No Micro Level Program Found",
              description: "The AI couldn't find any locations or tables in the uploaded file.",
            });
          }
          setExtractedData(result.data);
        } else {
          throw new Error(result.error || 'An unknown error occurred.');
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast({
          variant: "destructive",
          title: "Extraction Failed",
          description: errorMessage,
        });
        setExtractedData(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "There was an error reading your file.",
        });
        setIsLoading(false);
    };
  };

  const handleReset = () => {
    setExtractedData(null);
    setFileName('');
  };

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
          {!extractedData ? (
            <FileUploader onFileProcess={handleFileProcess} isLoading={isLoading} />
          ) : (
            <TableViewer 
              initialData={extractedData} 
              onReset={handleReset}
              fileName={fileName}
            />
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
