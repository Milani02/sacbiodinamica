"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { TicketsTable } from "@/components/tickets/tickets-table";
import {
  TICKET_PRIORITY,
  TICKET_PRIORITY_ORDER,
  TICKET_STATUS,
  TICKET_STATUS_ORDER,
} from "@/features/tickets/constants";
import type { Sector, TicketWithRelations } from "@/types/domain";

const ALL = "all";

export function TicketsList({
  tickets,
  sectors,
}: {
  tickets: TicketWithRelations[];
  sectors: Sector[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [priority, setPriority] = useState<string>(ALL);
  const [sector, setSector] = useState<string>(ALL);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (status !== ALL && t.status !== status) return false;
      if (priority !== ALL && t.priority !== priority) return false;
      if (sector !== ALL && t.sectorId !== sector) return false;
      if (q) {
        const haystack =
          `${t.code} ${t.title} ${t.requester.name} ${t.requester.company ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tickets, query, status, priority, sector]);

  const hasFilters =
    query !== "" || status !== ALL || priority !== ALL || sector !== ALL;

  function clearFilters() {
    setQuery("");
    setStatus(ALL);
    setPriority(ALL);
    setSector(ALL);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <InputGroup className="lg:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Buscar por código, título ou cliente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ALL}>Todos os status</SelectItem>
                {TICKET_STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {TICKET_STATUS[s].label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ALL}>Toda prioridade</SelectItem>
                {TICKET_PRIORITY_ORDER.map((p) => (
                  <SelectItem key={p} value={p}>
                    {TICKET_PRIORITY[p].label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ALL}>Todos os setores</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X data-icon="inline-start" />
              Limpar
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length}{" "}
          {filtered.length === 1 ? "chamado" : "chamados"}
          {hasFilters ? " (filtrados)" : ""}
        </p>
      </div>

      <TicketsTable
        tickets={filtered}
        emptyHint={
          hasFilters
            ? "Nenhum chamado corresponde aos filtros. Ajuste a busca."
            : undefined
        }
      />
    </div>
  );
}
