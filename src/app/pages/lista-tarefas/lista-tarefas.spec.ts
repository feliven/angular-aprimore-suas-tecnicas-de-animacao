import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListaTarefas } from "./lista-tarefas";

describe("ListaTarefasComponent", () => {
  let component: ListaTarefas;
  let fixture: ComponentFixture<ListaTarefas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaTarefas],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTarefas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
