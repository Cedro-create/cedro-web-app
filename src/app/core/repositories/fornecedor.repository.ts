import { IRepository } from './repository.interface';
import { Fornecedor } from '../models/fornecedor.model';

export interface IFornecedorRepository extends IRepository<Fornecedor> {}
