import {
  CNV_CREDENTIAL,
  CNV_MATRICULA_LABEL,
  SITE_DISCLAIMER,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CnvNotice({
  prominent = false,
  className,
}: {
  prominent?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-2xl border px-5 py-4 sm:px-6",
        prominent
          ? "border-primary/25 bg-accent/70 py-5 sm:py-6"
          : "border-border bg-white",
        className,
      )}
      aria-label={CNV_MATRICULA_LABEL}
    >
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">
        {CNV_MATRICULA_LABEL}
      </p>
      <p
        className={cn(
          "mt-2 leading-relaxed text-foreground",
          prominent ? "text-base sm:text-lg" : "text-sm",
        )}
      >
        {CNV_CREDENTIAL}.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {SITE_DISCLAIMER}
      </p>
    </aside>
  );
}
