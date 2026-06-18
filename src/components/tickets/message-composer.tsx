"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { addMessage } from "@/features/tickets/actions";

export function MessageComposer({
  ticketId,
  isInternal = false,
}: {
  ticketId: string;
  isInternal?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();

  function send() {
    if (!body.trim()) return;
    start(async () => {
      const res = await addMessage(ticketId, body, isInternal);
      if (res.ok) {
        setBody("");
        toast.success(isInternal ? "Nota adicionada" : "Mensagem enviada");
        router.refresh();
      } else {
        toast.error(res.error ?? "Não foi possível enviar.");
      }
    });
  }

  return (
    <InputGroup>
      <InputGroupTextarea
        placeholder={
          isInternal
            ? "Escreva uma nota interna (visível só para a equipe)..."
            : "Escreva uma resposta ao solicitante..."
        }
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={pending}
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          className="ml-auto"
          onClick={send}
          disabled={pending || !body.trim()}
        >
          {pending ? <Spinner data-icon="inline-start" /> : <Send data-icon="inline-start" />}
          {isInternal ? "Adicionar nota" : "Responder"}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
