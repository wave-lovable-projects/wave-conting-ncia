import { useState, useRef, type DragEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CSV_HEADERS = ['name', 'accountId', 'niche', 'product', 'accountStatus', 'usageStatus', 'paymentType', 'bank', 'cardLast4'];

export function UploadLoteDialog({ open, onOpenChange }: Props) {
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; errors: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n').map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    if (lines.length < 2) { toast({ title: 'CSV inválido', variant: 'destructive' }); return; }
    setHeaders(lines[0]);
    setRows(lines.slice(1));
    setResult(null);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) { toast({ title: 'Apenas arquivos CSV', variant: 'destructive' }); return; }
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };

  const handleImport = async () => {
    setImporting(true);
    await new Promise(r => setTimeout(r, 800));
    const errors = Math.floor(rows.length * 0.1);
    setResult({ created: rows.length - errors, errors });
    setImporting(false);
    toast({ title: `${rows.length - errors} contas importadas` });
  };

  const downloadTemplate = () => {
    const csv = CSV_HEADERS.join(',') + '\nConta Exemplo,1234567890,Ecommerce,Produto X,ACTIVE,IN_USE,CREDIT,Nubank,1234';
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'template-contas.csv';
    a.click();
  };

  const handleClose = (v: boolean) => { if (!v) { setRows([]); setHeaders([]); setResult(null); } onOpenChange(v); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Contas via CSV</DialogTitle>
          <DialogDescription>Faça upload de um arquivo CSV com os dados das contas</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" /> Baixar template CSV
          </Button>

          {rows.length === 0 && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-primary bg-surface-2' : 'border-border hover:border-muted-foreground'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Arraste um arquivo CSV ou clique para selecionar</p>
              <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          )}

          {rows.length > 0 && !result && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {rows.length} linhas encontradas
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-1">
                      {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 5).map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => <TableCell key={j} className="text-xs">{cell}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {rows.length > 5 && <p className="text-xs text-muted-foreground">...e mais {rows.length - 5} linhas</p>}
            </>
          )}

          {result && (
            <div className="rounded-lg bg-surface-2 p-4 space-y-1">
              <p className="text-sm text-success font-medium">✓ {result.created} contas criadas</p>
              {result.errors > 0 && <p className="text-sm text-destructive">✗ {result.errors} erros</p>}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Fechar</Button>
          {rows.length > 0 && !result && (
            <Button onClick={handleImport} disabled={importing}>{importing ? 'Importando...' : 'Importar'}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
