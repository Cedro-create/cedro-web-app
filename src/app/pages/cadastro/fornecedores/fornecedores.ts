import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FORNECEDOR_REPOSITORY } from '../../../core/tokens';
import { IFornecedorRepository } from '../../../core/repositories/fornecedor.repository';
import { Fornecedor } from '../../../core/models/fornecedor.model';

@Component({
  selector: 'app-fornecedores',
  imports: [CommonModule, FormsModule],
  templateUrl: './fornecedores.html',
  styleUrl: './fornecedores.css',
  standalone: true
})
export class FornecedoresComponent {
  fornecedores = signal<Fornecedor[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);

  formData = signal({
    nome: '',
    contato: '',
    email: '',
    telefone: ''
  });

  constructor(
    @Inject(FORNECEDOR_REPOSITORY)
    private fornecedorRepository: IFornecedorRepository
  ) {
    this.loadFornecedores();
  }

  loadFornecedores() {
    this.fornecedorRepository.getAll().subscribe(fornecedores => {
      this.fornecedores.set(fornecedores);
    });
  }

  openModal(fornecedor?: Fornecedor) {
    if (fornecedor) {
      this.editingId.set(fornecedor.id);
      this.formData.set({
        nome: fornecedor.nome,
        contato: fornecedor.contato,
        email: fornecedor.email,
        telefone: fornecedor.telefone
      });
    } else {
      this.editingId.set(null);
      this.formData.set({ nome: '', contato: '', email: '', telefone: '' });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId.set(null);
    this.formData.set({ nome: '', contato: '', email: '', telefone: '' });
  }

  save() {
    const data = this.formData();
    if (!data.nome) return;

    if (this.editingId()) {
      this.fornecedorRepository
        .update(this.editingId()!, data)
        .subscribe(() => {
          this.loadFornecedores();
          this.closeModal();
        });
    } else {
      this.fornecedorRepository.create(data).subscribe(() => {
        this.loadFornecedores();
        this.closeModal();
      });
    }
  }

  delete(id: string) {
    if (confirm('Deseja excluir este fornecedor?')) {
      this.fornecedorRepository.delete(id).subscribe(() => {
        this.loadFornecedores();
      });
    }
  }

  updateFormField(field: string, value: any) {
    let fieldValue = value;
    if (value && typeof value === 'object' && 'target' in value) {
      fieldValue = (value.target as any).value;
    }
    const current = this.formData();
    this.formData.set({ ...current, [field]: fieldValue });
  }
}
