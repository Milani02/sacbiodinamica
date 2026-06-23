/**
 * Tópicos do formulário de abertura do cliente ("Assunto").
 * Cada tópico define campos próprios. Todos roteiam para a fila "SAC Geral".
 */

export type TopicFieldType = "text" | "textarea";

export interface TopicField {
  key: string;
  label: string;
  type: TopicFieldType;
  required?: boolean;
}

export interface TopicFileField {
  key: string;
  label: string;
  /** accept attribute for the file input */
  accept: string;
  required?: boolean;
}

export interface Topic {
  id: string;
  label: string;
  description: string;
  /** Campos de texto que viram `details`. */
  fields: TopicField[];
  /** Campo livre que vira a descrição do ticket (opcional). */
  describe?: TopicField;
  /** Campos de arquivo (anexos). */
  files: TopicFileField[];
}

// ---- Campos reutilizados ----
const razao: TopicField = { key: "razao_social", label: "Razão social", type: "text", required: true };
const cnpj: TopicField = { key: "cnpj", label: "Número do CNPJ", type: "text", required: true };
const endereco: TopicField = { key: "endereco", label: "Endereço completo com CEP", type: "text", required: true };
const nf: TopicField = { key: "nf", label: "Número da NF", type: "text", required: true };
const produto: TopicField = { key: "produto", label: "Produto", type: "text", required: true };
const telefone: TopicField = { key: "telefone", label: "Telefone para contato", type: "text", required: true };
const transportadora: TopicField = { key: "transportadora", label: "Transportadora", type: "text", required: true };

const descrever: TopicField = { key: "descricao", label: "Descreva o ocorrido", type: "textarea", required: true };

const fotoProduto: TopicFileField = { key: "foto_produto", label: "Foto / vídeo do produto com nº de lote", accept: "image/*,video/*" };
const fotosVideos: TopicFileField = { key: "fotos_videos", label: "Fotos e vídeos", accept: "image/*,video/*" };
const documentos: TopicFileField = { key: "documentos", label: "Documentos", accept: "image/*,application/pdf,.pdf" };

export const TOPICS: Topic[] = [
  {
    id: "produto-divergente",
    label: "Produto divergente",
    description: "Produto enviado incorreto, quantidade errada ou falta de produtos.",
    fields: [razao, cnpj, endereco, nf, produto],
    files: [fotoProduto],
    describe: descrever,
  },
  {
    id: "produto-avaria",
    label: "Produto com vazamento ou falta de componentes",
    description: "Avaria na embalagem, vazamentos ou falta de algum item.",
    fields: [razao, cnpj, endereco, nf, produto],
    files: [fotoProduto],
    describe: descrever,
  },
  {
    id: "produto-nao-conforme",
    label: "Produto não conforme",
    description: "Produto não atingiu as expectativas, resultado fora do padrão.",
    fields: [razao, cnpj, endereco, nf, produto],
    files: [fotoProduto],
    describe: descrever,
  },
  {
    id: "transportadora",
    label: "Problemas com transportadora",
    description: "Produtos trocados, avarias, atraso na entrega, roubos etc.",
    fields: [razao, cnpj, transportadora, nf],
    files: [fotosVideos],
    describe: descrever,
  },
  {
    id: "pedido-incorreto",
    label: "Compra / pedidos incorretos",
    description: "Compra ou pedido gerado de forma incorreta, cancelamento.",
    fields: [razao, cnpj, endereco, nf, produto],
    files: [fotoProduto],
    describe: descrever,
  },
  {
    id: "duvidas-tecnicas",
    label: "Informações e dúvidas técnicas",
    description: "Informações sobre os produtos e dúvidas técnicas de utilização.",
    fields: [razao, cnpj, endereco, telefone, produto],
    files: [],
    describe: { key: "duvida", label: "Dúvida", type: "textarea", required: true },
  },
  {
    id: "regulatorio",
    label: "Assuntos regulatórios",
    description: "Alvará, Licença Sanitária, FISPQ, instruções de uso etc.",
    fields: [razao, cnpj, produto],
    files: [documentos],
    describe: { key: "observacoes", label: "Observações", type: "textarea", required: false },
  },
  {
    id: "comercial",
    label: "Interesse comercial",
    description: "Informações comerciais, compras, parcerias.",
    fields: [razao, cnpj, endereco, telefone],
    files: [],
    describe: { key: "mensagem", label: "Mensagem", type: "textarea", required: true },
  },
  {
    id: "financeiro",
    label: "Assuntos financeiros",
    description: "Solicitações financeiras, boletos, notas fiscais.",
    fields: [razao, cnpj, endereco, nf, { key: "resumo", label: "Resumo", type: "text", required: true }],
    files: [],
    describe: descrever,
  },
  {
    id: "outros",
    label: "Outros",
    description: "Elogios e críticas, RH, eventos.",
    fields: [razao, cnpj, endereco, telefone, { key: "resumo", label: "Resumo", type: "text", required: true }],
    files: [],
    describe: descrever,
  },
];

export const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));

export function getTopic(id: string): Topic | undefined {
  return TOPIC_BY_ID.get(id);
}
