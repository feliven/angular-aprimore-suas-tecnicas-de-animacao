import { Injectable, inject, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, withLatestFrom } from "rxjs";

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
      const listaTarefas = this.tarefasSubject.getValue(); // no nested subscribe
      listaTarefas.unshift(tarefaCriada);
      this.tarefasSubject.next(listaTarefas);
    });
  }

  editar(tarefaParaAtualizar: Tarefa): void {
    const url = `${this.API}/${tarefaParaAtualizar.id}`;

    this.http.put<Tarefa>(url, tarefaParaAtualizar).subscribe((tarefaAtualizada) => {
      const listaTarefas = this.tarefasSubject.getValue();
      const index = listaTarefas.findIndex((tarefa) => tarefa.id === tarefaAtualizada.id);

      if (index > -1) {
        // listaTarefas.splice(index, 1, tarefaAtualizada);
        listaTarefas[index] = tarefaAtualizada;
        this.tarefasSubject.next(listaTarefas);
      }
      console.log("tarefaAtualizada:", tarefaAtualizada);
    });
  }

  excluir(id: number): void {
    const url = `${this.API}/${id}`;

    this.http.delete<Tarefa>(url).subscribe(() => {
      const listaTarefas = this.tarefasSubject.getValue();
      console.log("listaTarefas.length - antes:", listaTarefas.length);

      const index = listaTarefas.findIndex((tarefa) => tarefa.id === id);

      // if (!tarefaRemovida) throw new Error("Tarefa removida não foi encontrada");

      if (index > -1) {
        listaTarefas.splice(index, 1);
        this.tarefasSubject.next(listaTarefas);
      }

      console.log("listaTarefas.length - depois:", listaTarefas.length);
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
