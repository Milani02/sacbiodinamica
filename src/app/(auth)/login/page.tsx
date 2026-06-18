"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BrandMark } from "@/components/layout/brand-mark";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente novamente.",
      );
      setLoading(false);
      return;
    }

    // Navegação de página inteira: garante que o cookie de sessão recém-criado
    // seja enviado ao servidor, evitando a corrida que prendia o usuário no login.
    window.location.assign("/dashboard");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <BrandMark />
          </div>
          <span className="font-semibold tracking-tight">SAC Biodinâmica</span>
        </div>
        <div className="max-w-sm">
          <p className="text-2xl font-medium leading-snug tracking-tight">
            Atendimento que cresce com cuidado.
          </p>
          <p className="mt-3 text-sm text-sidebar-foreground/70">
            Centralize chamados, organize a equipe e acompanhe cada solicitação
            do início ao fim.
          </p>
        </div>
        <span className="text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} Biodinâmica
        </span>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BrandMark />
            </div>
            <span className="font-semibold tracking-tight">SAC Biodinâmica</span>
          </div>

          <div className="mb-6 grid gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Entrar na plataforma
            </h1>
            <p className="text-sm text-muted-foreground">
              Use seu e-mail corporativo para acessar a central.
            </p>
          </div>

          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Não foi possível entrar</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@biodinamica.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner data-icon="inline-start" /> : null}
                Entrar
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            É cliente e ainda não tem conta?{" "}
            <Link
              href="/registro"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
