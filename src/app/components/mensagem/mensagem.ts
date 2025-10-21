import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mensagem",
  templateUrl: "./mensagem.html",
  styleUrls: ["./mensagem.css"],
})
export class Mensagem {
  @Input() mensagemValidacao: string = "";
}
