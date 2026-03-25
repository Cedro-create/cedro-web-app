import { IRepository } from './repository.interface';
import { Servico } from '../models/servico.model';

export interface IServicoRepository extends IRepository<Servico> {}
