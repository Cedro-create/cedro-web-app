import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { AgendaComponent } from './pages/agenda/agenda';
import { ServicosComponent } from './pages/cadastro/servicos/servicos';
import { ClientesComponent } from './pages/cadastro/clientes/clientes';
import { FornecedoresComponent } from './pages/cadastro/fornecedores/fornecedores';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'agenda', component: AgendaComponent },
      {
        path: 'cadastro',
        children: [
          { path: 'servicos', component: ServicosComponent },
          { path: 'clientes', component: ClientesComponent },
          { path: 'fornecedores', component: FornecedoresComponent },
          { path: '', redirectTo: 'servicos', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'agenda', pathMatch: 'full' }
    ]
  }
];
