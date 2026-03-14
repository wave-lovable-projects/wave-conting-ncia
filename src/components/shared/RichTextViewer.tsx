import { cn } from '@/lib/utils';

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
  // If content has no HTML tags, render as plain text
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    return <p className="text-sm text-muted-foreground mt-1">{content}</p>;
  }

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-muted-foreground mt-1',
        'prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0',
        'prose-headings:text-foreground prose-p:text-foreground',
        'prose-strong:text-foreground prose-em:text-foreground',
        'prose-a:text-primary prose-a:underline',
        'prose-ul:list-disc prose-ul:pl-4',
        'prose-ol:list-decimal prose-ol:pl-4',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
