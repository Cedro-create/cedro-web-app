export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  data: string; // ISO date 'YYYY-MM-DD'
  horaInicio: string; // '08:00'
  horaFim: string; // '09:30'
  clienteIds: string[];
  servicoIds: string[];
  fornecedorIds: string[];
}
