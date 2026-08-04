# E-mail de lançamento — Central de Atendimento

`convite-central-atendimento.html` é um e-mail pronto para enviar aos clientes, anunciando a nova Central de Atendimento (SAC Biodinâmica) e convidando a criar conta.

## Como usar

1. Abra `convite-central-atendimento.html` no navegador para conferir o visual.
2. **Antes de enviar, atualize o link do botão** (atualmente `https://sac.biodinamica.com.br/registro`) — esse domínio ainda não está no ar (só `http://192.168.1.25:3000` na rede local). Troque para a URL real assim que a central estiver publicada.
3. Copie o HTML inteiro do arquivo e cole no editor de HTML da sua ferramenta de disparo (Mailchimp, RD Station, Outlook em modo "Editor de código", etc.) — a maioria tem uma opção "Inserir HTML" ou "Editar código-fonte".
4. Envie um teste para si mesmo antes do disparo em massa, especialmente se for usar o Outlook desktop (ver nota abaixo).

## Detalhes técnicos

- Layout em tabelas + estilos inline, compatível com os principais clientes de e-mail (Gmail, Outlook, Apple Mail, Yahoo).
- Logo embutida como imagem base64 (não depende de nenhum servidor de imagens) — funciona em quase todos os clientes; alguns Outlook desktop antigos podem não exibir imagens base64. Se notar isso no teste, suba a logo (`public/logo-biodinamica.png`) em algum lugar público e troque o `src` da tag `<img>` por essa URL.
- Se adaptar cores/fontes, edite `docs/_tools/build_email.py` e rode `python build_email.py` (regenera o HTML a partir do template, reaproveitando a logo já convertida em `docs/_tools/_logo_b64.txt`).
