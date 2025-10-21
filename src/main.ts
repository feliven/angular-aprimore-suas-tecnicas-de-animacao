import { provideHttpClient } from "@angular/common/http";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { ListaTarefas } from "./app/pages/lista-tarefas/lista-tarefas";
import { App } from "./app/app";

// import { AppModule } from "./app/app.module";

bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter([
      {
        path: "",
        redirectTo: "listaTarefas",
        pathMatch: "full",
        data: {
          reuseComponent: true,
        },
      },
      {
        path: "listaTarefas",
        component: ListaTarefas,
        data: {
          reuseComponent: true,
        },
      },
    ]),
  ],
});

// platformBrowser()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));
