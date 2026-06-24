import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logo da Biodinâmica (JPG com fundo branco).
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
      src="/logo-biodinamica.jpg"
      alt="Biodinâmica"
      width={300}
      height={120}
      priority
      className={cn(
        "h-10 w-auto",
        onDark ? "rounded-md bg-white p-1.5" : "rounded-sm",
        className,
      )}
    />
  );
}
