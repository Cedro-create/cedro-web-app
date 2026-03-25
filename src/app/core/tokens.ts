import { InjectionToken } from '@angular/core';
import { IServicoRepository } from './repositories/servico.repository';
import { IClienteRepository } from './repositories/cliente.repository';
import { IFornecedorRepository } from './repositories/fornecedor.repository';
import { IEventoRepository } from './repositories/evento.repository';

export const SERVICO_REPOSITORY = new InjectionToken<IServicoRepository>(
  'ServicoRepository'
);

export const CLIENTE_REPOSITORY = new InjectionToken<IClienteRepository>(
  'ClienteRepository'
);

export const FORNECEDOR_REPOSITORY = new InjectionToken<IFornecedorRepository>(
  'FornecedorRepository'
);

export const EVENTO_REPOSITORY = new InjectionToken<IEventoRepository>(
  'EventoRepository'
);
