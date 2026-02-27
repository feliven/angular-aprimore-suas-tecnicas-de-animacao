import { Component, input } from "@angular/core";

@Component({
  selector: "app-mensagem",
  templateUrl: "./mensagem.html",
  styleUrls: ["./mensagem.css"],
})
export class Mensagem {
  readonly mensagemValidacao = input<string>("");
}
