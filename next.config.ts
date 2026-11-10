import type { NextConfig } from "next";

// Cabeçalhos de segurança HTTP (corrige o desvio DV-02 da validação FB7.21-20).
// HSTS só tem efeito sob HTTPS (produção). A CSP é permissiva o suficiente para
// não quebrar a aplicação (Next + Supabase), mas protege contra clickjacking
// (frame-ancestors) e restringe origens de conexão ao próprio site e ao Supabase.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return "*.supabase.co";
  }
})();

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://*.supabase.co wss://*.supabase.co`,
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  // Permite acessar o dev server por outros hosts da rede (ex.: o IP da LAN).
  // Sem isso, o Next 16 bloqueia recursos de dev para origens externas e a
  // página não hidrata (o login submeteria como GET nativo).
  allowedDevOrigins: ["192.168.1.25"],
  // Esconde o indicador flutuante de dev do Next (o "N" no canto da tela).
  devIndicators: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
