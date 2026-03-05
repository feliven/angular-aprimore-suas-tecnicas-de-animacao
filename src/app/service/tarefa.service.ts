import { Injectable, inject, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

import { Tarefa } from "../interface/tarefa";

@Injectable({
  providedIn: "root",
})
export class TarefaService {
  private http = inject(HttpClient);

  private readonly API = "http://localhost:3000/tarefas";
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  tarefas$ = this.tarefasSubject.asObservable();

  listar(): void {
    let params = new HttpParams().appendAll({
      _sort: "id",
      _order: "desc",
    });

    const listaAtualTarefas = signal(this.tarefasSubject.getValue());

    this.http.get<Tarefa[]>(this.API, { params }).subscribe((tarefas) => {
      console.log("listaAtualTarefas():", listaAtualTarefas());

      listaAtualTarefas.set(listaAtualTarefas().concat(tarefas));

      console.log("lista() atualizada:", listaAtualTarefas());

      this.tarefasSubject.next(listaAtualTarefas());
    });
  }

  criar(tarefa: Tarefa): void {
    this.http.post<Tarefa>(this.API, tarefa).subscribe((tarefaCriada) => {
      const tarefaParaAdicionar = tarefaCriada;
      this.tarefas$.subscribe((listaTarefas) => {
        listaTarefas.push(tarefaParaAdicionar);
        console.log("listaTarefas:", listaTarefas);
      });
    });
  }

  editar(tarefaParaAtualizar: Tarefa): void {
    const url = `${this.API}/${tarefaParaAtualizar.id}`;
    this.http.put<Tarefa>(url, tarefaParaAtualizar).subscribe((tarefaAtualizada) => {
      const tarefaParaSalvar = tarefaAtualizada;

      this.tarefas$.subscribe((listaTarefas) => {
        console.log("listaTarefas.length - antes:", listaTarefas.length);
        const index = listaTarefas.indexOf(tarefaParaAtualizar);

        if (index > -1) {
          listaTarefas.splice(index, 1, tarefaParaSalvar);
        }
        console.log("listaTarefas.length - depois:", listaTarefas.length);
      });
    });
  }

  excluir(id: number): void {
    const url = `${this.API}/${id}`;

    this.http.delete<Tarefa>(url).subscribe(() => {
      this.tarefas$.subscribe((listaTarefas) => {
        console.log("listaTarefas.length - antes:", listaTarefas.length);

        const tarefaRemovida = listaTarefas.find((tarefa) => tarefa.id === id);

        console.log("tarefaRemovida:", tarefaRemovida);

        if (!tarefaRemovida) throw new Error("Tarefa removida não foi encontrada");

        const index = listaTarefas.indexOf(tarefaRemovida);
        if (index > -1) {
          listaTarefas.splice(index, 1);
        }

        console.log("listaTarefas.length - depois:", listaTarefas.length);
      });
    });
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }

  atualizarStatusTarefa(tarefa: Tarefa): void {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
    this.editar(tarefa);
  }
}
