import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logo da Biodinâmica (PNG transparente).
 * Em fundo escuro mostramos dentro de um cartão branco para contraste.
 */
export function BrandLogo({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logo-biodinamica.png"
      alt="Biodinâmica"
      width={300}
      height={120}
      priority
      className={cn(
        // largura proporcional fixa (ratio ~2.5:1) p/ não esticar no flex-col
        "h-auto w-[120px] shrink-0 self-start object-contain",
        onDark ? "rounded-md bg-white p-1.5" : null,
        className,
      )}
    />
  );
}
