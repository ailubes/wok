import { cn } from "@/lib/utils";

interface TextColumnProps {
  title: string;
  content: string | null;
  bgColor?: string;
  isEditable?: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function TextColumn({
  title,
  content,
  bgColor = "bg-card",
  isEditable = false,
  emptyMessage = "Текст не вказано",
  children,
}: TextColumnProps) {
  return (
    <div className={cn(
      "flex flex-col border border-border rounded-lg overflow-hidden h-full shadow-sm",
      bgColor
    )}>
      {/* Column Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
          {title}
        </h3>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {content ? (
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap break-words text-foreground leading-relaxed">
              {content}
            </div>
          </div>
        ) : children ? (
          children
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
