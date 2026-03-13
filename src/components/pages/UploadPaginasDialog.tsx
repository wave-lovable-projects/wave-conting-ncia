import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadPaginasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CSV_TEMPLATE = 'name,pageId,bmId,supplierId,status,receivedAt,managerId,notes';

export function UploadPaginasDialog({ open, onOpenChange }: UploadPaginasDialogProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { toast({ title: 'Arquivo vazio ou inválido', variant: 'destructive' }); return; }
      setHeaders(lines[0].split(',').map(h => h.trim()));
      setRows(lines.slice(1, 6).map(l => l.split(',').map(c => c.trim())));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFile(file); };
  const handleImport = () => { setImported(true); toast({ title: `${rows.length} páginas importadas com sucesso` }); };
  const downloadTemplate = () => { const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'template-paginas.csv'; a.click(); };

  const handleClose = (v: boolean) => { if (!v) { setRows([]); setHeaders([]); setImported(false); } onOpenChange(v); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Páginas via CSV</DialogTitle>
          <DialogDescription>Faça upload de um arquivo CSV com os dados das páginas</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={downloadTemplate}><Download className="h-4 w-4 mr-2" /> Baixar Template</Button>
          {rows.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}>
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arraste um arquivo CSV ou clique para selecionar</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{rows.length} linhas encontradas (preview das primeiras 5)</p>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader><TableRow>{headers.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j} className="text-sm">{c}</TableCell>)}</TableRow>)}</TableBody>
                </Table>
              </div>
              {!imported ? (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setRows([]); setHeaders([]); }}>Cancelar</Button>
                  <Button onClick={handleImport}><FileText className="h-4 w-4 mr-2" /> Importar</Button>
                </div>
              ) : (
                <p className="text-sm text-success text-center">Importação concluída com sucesso!</p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
