import { IRepository } from './repository.interface';
import { Cliente } from '../models/cliente.model';

export interface IClienteRepository extends IRepository<Cliente> {}
