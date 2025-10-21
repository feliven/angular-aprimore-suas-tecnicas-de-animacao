import { Component } from "@angular/core";
import { Cabecalho } from "./components/cabecalho/cabecalho";
import { AppRoutingModule } from "./app-routing.module";
import { Rodape } from "./components/rodape/rodape";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
  imports: [Cabecalho, AppRoutingModule, Rodape],
})
export class App {
  title = "2806-memorando";
}
