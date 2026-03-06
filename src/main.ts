import { provideCheckNoChangesConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";

import { ListaTarefas } from "./app/pages/lista-tarefas/lista-tarefas";
import { App } from "./app/app";

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(),
    provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 }),
    provideRouter([
      {
        path: "",
        redirectTo: "listaTarefas",
        pathMatch: "full",
      },
      {
        path: "listaTarefas",
        component: ListaTarefas,
      },
    ]),
  ],
});
