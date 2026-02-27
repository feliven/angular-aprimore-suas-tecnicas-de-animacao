import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
// import { filter } from "rxjs";

import { TarefaService } from "../../service/tarefa.service";
import { Tarefa } from "../../interface/tarefa";
import { Mensagem } from "../../components/mensagem/mensagem";
import { botaoCheckTrigger, highlightedStateTrigger, shownStateTrigger } from "../../animations";

@Component({
  selector: "app-lista-tarefas",
  templateUrl: "./lista-tarefas.html",
  styleUrls: ["./lista-tarefas.css"],
  imports: [Mensagem, CommonModule, ReactiveFormsModule],
  animations: [highlightedStateTrigger, shownStateTrigger, botaoCheckTrigger],
})
export class ListaTarefas implements OnInit {
  private service = inject(TarefaService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  listaTarefas: Tarefa[] = [];
  formAberto: boolean = false;
  categoria: string = "";
  validado: boolean = false;
  indexTarefa = -1;
  id: number = 0;

  formulario: FormGroup = this.formBuilder.group({
    id: [0],
    descricao: ["", Validators.required],
    statusFinalizado: [false, Validators.required],
    categoria: ["", Validators.required],
    prioridade: ["", Validators.required],
  });

  ngOnInit(): Tarefa[] {
    this.service.listar(this.categoria).subscribe((listaTarefas) => {
      this.listaTarefas = listaTarefas;
    });
    return this.listaTarefas;
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
    this.resetarFormulario();
  }

  salvarTarefa() {
    if (this.formulario.value.id) {
      this.editarTarefa();
    } else {
      this.criarTarefa();
    }
  }

  editarTarefa() {
    this.service.editar(this.formulario.value).subscribe({
      complete: () => this.atualizarComponente(),
    });
  }

  criarTarefa() {
    this.service.criar(this.formulario.value).subscribe({
      complete: () => this.atualizarComponente(),
    });
  }

  excluirTarefa(id: number) {
    if (id) {
      this.service.excluir(id).subscribe({
        complete: () => this.recarregarComponente(),
      });
    }
  }

  cancelar() {
    this.resetarFormulario();
    this.formAberto = false;
  }

  resetarFormulario() {
    this.formulario.reset({
      descricao: "",
      statusFinalizado: false,
      categoria: "",
      prioridade: "",
    });
  }

  recarregarComponente() {
    this.router.navigate(["/listaTarefas"]);
  }

  atualizarComponente() {
    this.recarregarComponente();
    this.resetarFormulario();
  }

  carregarParaEditar(id: number) {
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.formulario = this.formBuilder.group({
        id: [tarefa.id],
        descricao: [tarefa.descricao],
        categoria: [tarefa.categoria],
        statusFinalizado: [tarefa.statusFinalizado],
        prioridade: [tarefa.prioridade],
      });
    });
    this.formAberto = true;
  }

  finalizarTarefa(id: number) {
    this.id = id;
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.service.atualizarStatusTarefa(tarefa).subscribe(() => {
        this.listarAposCheck();
      });
    });
  }

  listarAposCheck() {
    this.service.listar(this.categoria).subscribe((listaTarefas) => {
      this.listaTarefas = listaTarefas;
    });
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return "botao-salvar";
    } else return "botao-desabilitado";
  }

  campoValidado(campoAtual: string): string {
    if (this.formulario.get(campoAtual)?.errors && this.formulario.get(campoAtual)?.touched) {
      this.validado = false;
      return "form-tarefa input-invalido";
    } else {
      this.validado = true;
      return "form-tarefa";
    }
  }
}
