import { IRepository } from './repository.interface';
import { Evento } from '../models/evento.model';

export interface IEventoRepository extends IRepository<Evento> {}
