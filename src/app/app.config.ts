import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { SERVICO_REPOSITORY, CLIENTE_REPOSITORY, FORNECEDOR_REPOSITORY, EVENTO_REPOSITORY } from './core/tokens';
import { ServicoMockRepository } from './core/repositories/mock/servico.mock.repository';
import { ClienteMockRepository } from './core/repositories/mock/cliente.mock.repository';
import { FornecedorMockRepository } from './core/repositories/mock/fornecedor.mock.repository';
import { EventoMockRepository } from './core/repositories/mock/evento.mock.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: SERVICO_REPOSITORY, useClass: ServicoMockRepository },
    { provide: CLIENTE_REPOSITORY, useClass: ClienteMockRepository },
    { provide: FORNECEDOR_REPOSITORY, useClass: FornecedorMockRepository },
    { provide: EVENTO_REPOSITORY, useClass: EventoMockRepository }
  ]
};
