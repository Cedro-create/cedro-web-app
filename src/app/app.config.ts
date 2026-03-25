import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { SERVICO_REPOSITORY, CLIENTE_REPOSITORY, FORNECEDOR_REPOSITORY, EVENTO_REPOSITORY } from './core/tokens';
import { ServicoHttpRepository } from './core/repositories/http/servico.http.repository';
import { ClienteHttpRepository } from './core/repositories/http/cliente.http.repository';
import { FornecedorHttpRepository } from './core/repositories/http/fornecedor.http.repository';
import { EventoHttpRepository } from './core/repositories/http/evento.http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    { provide: SERVICO_REPOSITORY, useClass: ServicoHttpRepository },
    { provide: CLIENTE_REPOSITORY, useClass: ClienteHttpRepository },
    { provide: FORNECEDOR_REPOSITORY, useClass: FornecedorHttpRepository },
    { provide: EVENTO_REPOSITORY, useClass: EventoHttpRepository }
  ]
};
