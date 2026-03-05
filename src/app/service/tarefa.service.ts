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

  criar(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.API, tarefa);
  }

  editar(tarefa: Tarefa): Observable<Tarefa> {
    const url = `${this.API}/${tarefa.id}`;
    return this.http.put<Tarefa>(url, tarefa);
  }

  excluir(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.delete<Tarefa>(url);
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }

  atualizarStatusTarefa(tarefa: Tarefa): Observable<Tarefa> {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
    return this.editar(tarefa);
  }
}
