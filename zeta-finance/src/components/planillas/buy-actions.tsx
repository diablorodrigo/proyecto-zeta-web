import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  isMercadoPagoReady,
  planillaBuyHref,
  planillaConsultHref,
  type PlanillaPaymentId,
} from "@/lib/planillas";
import { cn } from "@/lib/utils";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.4A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.8.9-3.1-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.6 4.1 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

export function BuyActions({
  id,
  priceLabel,
  onDark = false,
}: {
  id: PlanillaPaymentId;
  priceLabel: string;
  onDark?: boolean;
}) {
  const ready = isMercadoPagoReady(id);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <Link
        href={planillaBuyHref(id)}
        target="_blank"
        rel="noopener noreferrer"
        data-checkout={ready ? "mercadopago" : "whatsapp"}
        title={
          ready
            ? "Pagar con Mercado Pago"
            : "Te abre WhatsApp con el pedido escrito"
        }
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full sm:w-auto",
          onDark
            ? "bg-background text-foreground hover:bg-background/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        Comprar · {priceLabel}
      </Link>
      <Link
        href={planillaConsultHref(id)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-full sm:w-auto",
          onDark
            ? "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            : "border-primary/30 bg-background text-foreground",
        )}
      >
        <WhatsAppIcon />
        Consultar por WhatsApp
      </Link>
    </div>
  );
}
