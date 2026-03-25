import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SERVICO_REPOSITORY } from '../../../core/tokens';
import { IServicoRepository } from '../../../core/repositories/servico.repository';
import { Servico } from '../../../core/models/servico.model';

@Component({
  selector: 'app-servicos',
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css',
  standalone: true
})
export class ServicosComponent {
  servicos = signal<Servico[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);

  formData = signal({
    nome: '',
    descricao: '',
    preco: 0
  });

  constructor(
    @Inject(SERVICO_REPOSITORY) private servicoRepository: IServicoRepository
  ) {
    this.loadServicos();
  }

  loadServicos() {
    this.servicoRepository.getAll().subscribe(servicos => {
      this.servicos.set(servicos);
    });
  }

  openModal(servico?: Servico) {
    if (servico) {
      this.editingId.set(servico.id);
      this.formData.set({
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco
      });
    } else {
      this.editingId.set(null);
      this.formData.set({ nome: '', descricao: '', preco: 0 });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId.set(null);
    this.formData.set({ nome: '', descricao: '', preco: 0 });
  }

  save() {
    const data = this.formData();
    if (!data.nome) return;

    if (this.editingId()) {
      this.servicoRepository
        .update(this.editingId()!, data)
        .subscribe(() => {
          this.loadServicos();
          this.closeModal();
        });
    } else {
      this.servicoRepository.create(data).subscribe(() => {
        this.loadServicos();
        this.closeModal();
      });
    }
  }

  delete(id: string) {
    if (confirm('Deseja excluir este serviço?')) {
      this.servicoRepository.delete(id).subscribe(() => {
        this.loadServicos();
      });
    }
  }

  updateFormField(field: string, event: any) {
    let value = event;
    if (event && typeof event === 'object' && 'target' in event) {
      value = (event.target as any).value;
    }
    if (field === 'preco') {
      value = parseFloat(value);
    }
    const current = this.formData();
    this.formData.set({ ...current, [field]: value });
  }
}
