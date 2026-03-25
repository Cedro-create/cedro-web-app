import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CLIENTE_REPOSITORY } from '../../../core/tokens';
import { IClienteRepository } from '../../../core/repositories/cliente.repository';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
  standalone: true
})
export class ClientesComponent {
  clientes = signal<Cliente[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);

  formData = signal({
    nome: '',
    email: '',
    telefone: ''
  });

  constructor(
    @Inject(CLIENTE_REPOSITORY) private clienteRepository: IClienteRepository
  ) {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteRepository.getAll().subscribe(clientes => {
      this.clientes.set(clientes);
    });
  }

  openModal(cliente?: Cliente) {
    if (cliente) {
      this.editingId.set(cliente.id);
      this.formData.set({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone
      });
    } else {
      this.editingId.set(null);
      this.formData.set({ nome: '', email: '', telefone: '' });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId.set(null);
    this.formData.set({ nome: '', email: '', telefone: '' });
  }

  save() {
    const data = this.formData();
    if (!data.nome) return;

    if (this.editingId()) {
      this.clienteRepository
        .update(this.editingId()!, data)
        .subscribe(() => {
          this.loadClientes();
          this.closeModal();
        });
    } else {
      this.clienteRepository.create(data).subscribe(() => {
        this.loadClientes();
        this.closeModal();
      });
    }
  }

  delete(id: string) {
    if (confirm('Deseja excluir este cliente?')) {
      this.clienteRepository.delete(id).subscribe(() => {
        this.loadClientes();
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
