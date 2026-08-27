import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'CIS Hub | Home',
  },
  {
    path: 'races',
    loadComponent: () =>
      import('./pages/races/races.component').then((m) => m.RacesComponent),
    title: 'CIS Hub | Campionati & Gare',
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then(
        (m) => m.GalleryComponent,
      ),
    title: 'CIS Hub | Risultati & Foto',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'CIS Hub | Chi Siamo',
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then((m) => m.FaqComponent),
    title: 'CIS Hub | FAQ & Regolamento',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    title: 'CIS Hub | Area Staff',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
