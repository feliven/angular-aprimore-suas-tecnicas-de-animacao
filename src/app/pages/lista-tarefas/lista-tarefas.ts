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
import { Subscription } from "rxjs";

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
  tarefasSubscription = signal<Subscription>(new Subscription());
  estadoBotao = signal<string>("unchecked");

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

    this.tarefasSubscription.set(
      this.service.tarefas$.subscribe({
        next: (arrayTarefas) => {
          console.log("this.listaTarefas - 1:", this.listaTarefas());
          this.listaTarefas.set(arrayTarefas);

          console.log("this.listaTarefas - 2:", this.listaTarefas());

          this.tarefasFiltradas.set(this.listaTarefas());
          console.log("this.tarefasFiltradas:", this.tarefasFiltradas());
        },

        complete: () => {
          this.dadosForamCarregados.set(true);
        },
      }),
    );
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

  criarTarefa() {
    if (this.formulario.valid) {
      const novaTarefa = this.formulario.value;
      this.service.criar(novaTarefa);

      console.log("nova tarefa criada:", novaTarefa);

      this.resetarFormulario();
    } else {
      console.error("Formulário INVÁLIDO");
    }
  }

  editarTarefa() {
    if (this.formulario.valid) {
      const tarefaParaEditar = this.formulario.value;
      this.service.editar(tarefaParaEditar, true);

      console.log("tarefa editada:", tarefaParaEditar);

      this.resetarFormulario();
      this.formAberto.set(false);
    } else {
      console.error("Formulário INVÁLIDO");
    }
  }

  excluirTarefa(tarefa: Tarefa) {
    if (tarefa.id) {
      this.service.excluir(tarefa.id);
    } else {
      console.error("ID da tarefa é INVÁLIDO");
    }
  }

  cancelar() {
    this.resetarFormulario();
    this.formAberto.set(false);
  }

  triggerShakeAnimation(controlName: string): boolean {
    return (this.formulario.get(controlName)?.touched && this.formulario.get(controlName)?.invalid) ?? false;
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
    this.scrollToTop();

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

  finalizarTarefa(tarefa: Tarefa) {
    this.id.set(tarefa.id);
    this.service.atualizarStatusTarefa(tarefa);

    if (tarefa.statusFinalizado == true) {
      this.estadoBotao.set("checked");
    } else {
      this.estadoBotao.set("unchecked");
    }
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

  private scrollToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
