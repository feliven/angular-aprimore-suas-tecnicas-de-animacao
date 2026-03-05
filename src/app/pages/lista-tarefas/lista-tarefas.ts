import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from "@angular/core";
import { NgClass } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
// import { filter } from "rxjs";

import { TarefaService } from "../../service/tarefa.service";
import { Tarefa } from "../../interface/tarefa";
import { Mensagem } from "../../components/mensagem/mensagem";
import {
  botaoCheckTrigger,
  filterTrigger,
  flyInOutTrigger,
  formButtonTrigger,
  highlightedStateTrigger,
  noTasksTrigger,
  shakeTrigger,
  shownStateTrigger,
} from "../../animations";

@Component({
  selector: "app-lista-tarefas",
  templateUrl: "./lista-tarefas.html",
  styleUrls: ["./lista-tarefas.css"],
  imports: [NgClass, ReactiveFormsModule, Mensagem],
  animations: [
    highlightedStateTrigger,
    shownStateTrigger,
    botaoCheckTrigger,
    filterTrigger,
    formButtonTrigger,
    noTasksTrigger,
    flyInOutTrigger,
    shakeTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaTarefas implements OnInit {
  private service = inject(TarefaService);
  private formBuilder = inject(FormBuilder);

  listaTarefas = signal<Tarefa[]>([]);
  tarefasFiltradas = signal<Tarefa[]>([]);
  dadosForamCarregados = signal<boolean>(false);
  formAberto = signal<boolean>(false);
  indexTarefa = signal<number>(-1);
  id = signal<number>(0);

  formulario: FormGroup = this.formBuilder.group({
    id: [0],
    descricao: ["", Validators.required],
    statusFinalizado: [false, Validators.required],
    categoria: ["", Validators.required],
    prioridade: ["", Validators.required],
  });

  campoBusca = new FormControl("", { nonNullable: true });

  constructor() {
    effect(() => {
      console.log("indexTarefa():", this.indexTarefa());
    });
  }

  ngOnInit(): void {
    this.service.listar();

    this.service.tarefas$.subscribe((arrayTarefas) => {
      console.log("this.listaTarefas - 1:", this.listaTarefas());
      this.listaTarefas.set(arrayTarefas);

      console.log("this.listaTarefas - 2:", this.listaTarefas());

      this.tarefasFiltradas.set(this.listaTarefas());
      console.log("this.tarefasFiltradas:", this.tarefasFiltradas());

      this.dadosForamCarregados.set(true);
    });
  }

  filtrarTarefas() {
    const filtro: string = this.campoBusca.value;

    const filtroTratado = filtro.trim().toLowerCase();

    console.log(`filtroTratado: '${filtroTratado}'`);

    if (filtroTratado) {
      const tarefasComFiltro = this.listaTarefas().filter((tarefa) => {
        return tarefa.descricao.toLowerCase().includes(filtroTratado);
      });
      this.tarefasFiltradas.set(tarefasComFiltro);
    } else {
      this.tarefasFiltradas.set(this.listaTarefas());
    }
  }

  mostrarOuEsconderFormulario() {
    this.formAberto.set(!this.formAberto());
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
    console.log("this.formulario.value:", this.formulario.value);

    this.service.editar(this.formulario.value);

    this.service.tarefas$.subscribe({
      complete: () => this.atualizarComponente(),
    });
  }

  criarTarefa() {
    this.service.criar(this.formulario.value);

    // this.service.listar();

    this.service.tarefas$.subscribe({
      next: (arrayTarefas) => {
        this.listaTarefas.set(arrayTarefas);
        console.log("this.listaTarefas com nova tarefa:", this.listaTarefas());
      },

      complete: () => this.atualizarComponente(),
    });
  }

  excluirTarefa(id: number) {
    if (id) {
      this.service.excluir(id);

      this.service.tarefas$.subscribe({
        complete: () => this.recarregarListaETerminarAcao(), // Call a unified action to refresh list and detect changes
      });
    }
  }

  cancelar() {
    this.resetarFormulario();
    this.formAberto.set(false);
  }

  triggerShakeAnimation(controlName: string): boolean {
    return (this.formulario.get(controlName)?.touched && this.formulario.get(controlName)?.invalid) ?? false;
  }

  atualizarComponente() {
    // This will reload the list, reset the form, close the form and trigger change detection.
    this.recarregarListaETerminarAcao();
    this.resetarFormulario(); // Reset form after saving, its validity changes.
  }

  // Unified method to refresh the list and ensure change detection
  recarregarListaETerminarAcao() {
    this.service.listar();

    console.log("recarregarListaETerminarAcao() chamado");

    this.service.tarefas$.subscribe((arrayTarefas) => {
      this.listaTarefas.set(arrayTarefas);
      this.formAberto.set(false); // Ensure form is closed after an action
      this.dadosForamCarregados.set(true);
    });
  }

  resetarFormulario() {
    this.formulario.reset({
      descricao: "",
      statusFinalizado: false,
      categoria: "",
      prioridade: "",
    });
  }

  carregarParaEditar(id: number) {
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.formulario.patchValue({
        id: tarefa.id,
        descricao: tarefa.descricao,
        categoria: tarefa.categoria,
        statusFinalizado: tarefa.statusFinalizado,
        prioridade: tarefa.prioridade,
      });
    });

    this.formAberto.set(true);
  }

  finalizarTarefa(id: number) {
    this.id.set(id);
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.service.atualizarStatusTarefa(tarefa);
      this.listarAposCheck();
    });
  }

  listarAposCheck() {
    this.service.listar();

    this.service.tarefas$.subscribe((arrayTarefas) => {
      this.tarefasFiltradas.set(arrayTarefas);
    });
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return "botao-salvar";
    } else return "botao-desabilitado";
  }

  campoValidado(campoAtual: string): string {
    if (this.formulario.get(campoAtual)?.errors && this.formulario.get(campoAtual)?.touched) {
      return "form-tarefa input-invalido";
    } else {
      return "form-tarefa";
    }
  }
}
