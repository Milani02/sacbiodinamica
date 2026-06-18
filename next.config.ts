import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acessar o dev server por outros hosts da rede (ex.: o IP da LAN).
  // Sem isso, o Next 16 bloqueia recursos de dev para origens externas e a
  // página não hidrata (o login submeteria como GET nativo).
  allowedDevOrigins: ["192.168.1.25"],
};

export default nextConfig;
