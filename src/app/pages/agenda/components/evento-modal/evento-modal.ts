import { Component, Input, Output, EventEmitter, Inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../../../core/models/evento.model';
import { CLIENTE_REPOSITORY, SERVICO_REPOSITORY, FORNECEDOR_REPOSITORY } from '../../../../core/tokens';
import { IClienteRepository } from '../../../../core/repositories/cliente.repository';
import { IServicoRepository } from '../../../../core/repositories/servico.repository';
import { IFornecedorRepository } from '../../../../core/repositories/fornecedor.repository';
import { Cliente } from '../../../../core/models/cliente.model';
import { Servico } from '../../../../core/models/servico.model';
import { Fornecedor } from '../../../../core/models/fornecedor.model';

const CORES = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
];

@Component({
  selector: 'app-evento-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evento-modal.html',
  styleUrl: './evento-modal.css',
  standalone: true
})
export class EventoModalComponent {
  @Input() set evento(value: Evento | undefined) {
    this.eventoSignal.set(value);
  }
  get evento(): Evento | undefined {
    return this.eventoSignal();
  }

  @Input() dataInicial?: string;
  @Input() horaInicial?: string;
  @Output() salvo = new EventEmitter<Evento>();
  @Output() fechado = new EventEmitter<void>();

  cores = CORES;

  clientes = signal<Cliente[]>([]);
  servicos = signal<Servico[]>([]);
  fornecedores = signal<Fornecedor[]>([]);

  formData = signal({
    nome: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '09:00',
    horaFim: '10:00',
    cor: CORES[0],
    clienteIds: [] as string[],
    servicoIds: [] as string[],
    fornecedorIds: [] as string[]
  });

  formDataInicial = signal({
    nome: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '09:00',
    horaFim: '10:00',
    cor: CORES[0],
    clienteIds: [] as string[],
    servicoIds: [] as string[],
    fornecedorIds: [] as string[]
  });

  temMudancas = computed(() => {
    const atual = this.formData();
    const inicial = this.formDataInicial();
    return JSON.stringify(atual) !== JSON.stringify(inicial);
  });

  private eventoSignal = signal<Evento | undefined>(undefined);

  constructor(
    @Inject(CLIENTE_REPOSITORY) private clienteRepo: IClienteRepository,
    @Inject(SERVICO_REPOSITORY) private servicoRepo: IServicoRepository,
    @Inject(FORNECEDOR_REPOSITORY) private fornecedorRepo: IFornecedorRepository
  ) {
    this.inicializarDados();

    // Reagir às mudanças do evento
    effect(() => {
      this.eventoSignal();
      this.inicializarFormulario();
    });
  }

  private inicializarDados() {
    this.clienteRepo.getAll().subscribe(clientes => this.clientes.set(clientes));
    this.servicoRepo.getAll().subscribe(servicos => this.servicos.set(servicos));
    this.fornecedorRepo.getAll().subscribe(fornecedores => this.fornecedores.set(fornecedores));
  }

  private inicializarFormulario() {
    if (this.evento) {
      const eventoData = {
        nome: this.evento.nome,
        descricao: this.evento.descricao,
        data: this.evento.data,
        horaInicio: this.evento.horaInicio,
        horaFim: this.evento.horaFim,
        cor: this.evento.cor,
        clienteIds: [...this.evento.clienteIds],
        servicoIds: [...this.evento.servicoIds],
        fornecedorIds: [...this.evento.fornecedorIds]
      };
      this.formData.set(eventoData);
      this.formDataInicial.set(eventoData);
    } else {
      const data = this.dataInicial || new Date().toISOString().split('T')[0];
      const horaInicio = this.horaInicial || '09:00';
      const horaFim = this.calcularHoraFim(horaInicio);

      const novoEvento = {
        nome: '',
        descricao: '',
        data,
        horaInicio,
        horaFim,
        cor: CORES[0],
        clienteIds: [] as string[],
        servicoIds: [] as string[],
        fornecedorIds: [] as string[]
      };
      this.formData.set(novoEvento);
      this.formDataInicial.set(novoEvento);
    }
  }

  private calcularHoraFim(horaInicio: string): string {
    const [h, m] = horaInicio.split(':').map(Number);
    let novaH = h;
    let novaM = m + 60;

    if (novaM >= 60) {
      novaH += 1;
      novaM -= 60;
    }

    return `${String(novaH).padStart(2, '0')}:${String(novaM).padStart(2, '0')}`;
  }

  updateFormField(field: string, eventOrValue: any) {
    let value = eventOrValue;
    if (eventOrValue && typeof eventOrValue === 'object' && 'target' in eventOrValue) {
      value = (eventOrValue.target as any).value;
    }
    const current = this.formData();
    this.formData.set({ ...current, [field]: value });
  }

  toggleCliente(clienteId: string) {
    const current = this.formData();
    const ids = current.clienteIds;
    const index = ids.indexOf(clienteId);
    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(clienteId);
    }
    this.formData.set({ ...current, clienteIds: [...ids] });
  }

  toggleServico(servicoId: string) {
    const current = this.formData();
    const ids = current.servicoIds;
    const index = ids.indexOf(servicoId);
    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(servicoId);
    }
    this.formData.set({ ...current, servicoIds: [...ids] });
  }

  toggleFornecedor(fornecedorId: string) {
    const current = this.formData();
    const ids = current.fornecedorIds;
    const index = ids.indexOf(fornecedorId);
    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(fornecedorId);
    }
    this.formData.set({ ...current, fornecedorIds: [...ids] });
  }

  isClienteSelecionado(clienteId: string): boolean {
    return this.formData().clienteIds.includes(clienteId);
  }

  isServicoSelecionado(servicoId: string): boolean {
    return this.formData().servicoIds.includes(servicoId);
  }

  isFornecedorSelecionado(fornecedorId: string): boolean {
    return this.formData().fornecedorIds.includes(fornecedorId);
  }

  fechar() {
    this.fechado.emit();
  }

  deletarEvento() {
    if (!this.evento) return;

    if (confirm('Tem certeza que deseja deletar este evento?')) {
      this.salvo.emit({ ...this.evento, _delete: true } as any);
      this.fechar();
    }
  }

  salvarEvento() {
    const data = this.formData();
    console.log('🔵 EventoModal: salvarEvento() chamado', data);

    if (!data.nome) {
      console.log('❌ EventoModal: nome vazio, abortando');
      return;
    }

    const eventoData = {
      nome: data.nome,
      descricao: data.descricao,
      cor: data.cor,
      data: data.data,
      horaInicio: data.horaInicio,
      horaFim: data.horaFim,
      clienteIds: data.clienteIds,
      servicoIds: data.servicoIds,
      fornecedorIds: data.fornecedorIds
    };

    const eventoCompleto: Evento = {
      id: this.evento?.id || String(Date.now()),
      ...eventoData
    };

    console.log('📤 EventoModal: emitindo evento', eventoCompleto);
    this.salvo.emit(eventoCompleto);
  }

  getCorHex(cor: string): string {
    return cor;
  }
}
