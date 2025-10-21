import { NgModule } from "@angular/core";
import { RouteReuseStrategy, RouterModule, Routes } from "@angular/router";
import { AppRouteReuseStrategy } from "./app-route-reuse-strategy";

import { ListaTarefas } from "./pages/lista-tarefas/lista-tarefas";

// const routes: Routes = [
//   {
//     path: "",
//     redirectTo: "listaTarefas",
//     pathMatch: "full",
//     data: {
//       reuseComponent: true,
//     },
//   },
//   {
//     path: "listaTarefas",
//     component: ListaTarefas,
//     data: {
//       reuseComponent: true,
//     },
//   },
// ];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
  providers: [{ provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }],
})
export class AppRoutingModule {}
