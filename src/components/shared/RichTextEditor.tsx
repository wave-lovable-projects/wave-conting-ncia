import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[80px] w-full rounded-md border-none bg-transparent px-3 py-2 text-sm',
          'focus:outline-none placeholder:text-muted-foreground',
          'prose prose-sm max-w-none',
          'prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0',
          'prose-headings:text-foreground prose-p:text-foreground',
          'prose-strong:text-foreground prose-em:text-foreground',
          'prose-a:text-primary prose-a:underline',
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && value === '') {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  if (!editor) return null;

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Negrito' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Itálico' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Lista' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Lista numerada' },
    {
      icon: LinkIcon,
      action: () => {
        const url = window.prompt('URL do link:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
        else editor.chain().focus().unsetLink().run();
      },
      active: editor.isActive('link'),
      label: 'Link',
    },
  ];

  return (
    <div className={cn('rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2', className)}>
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1">
        {tools.map(({ icon: Icon, action, active, label }) => (
          <Toggle
            key={label}
            size="sm"
            pressed={active}
            onPressedChange={() => action()}
            aria-label={label}
            className="h-7 w-7 p-0"
          >
            <Icon className="h-3.5 w-3.5" />
          </Toggle>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
