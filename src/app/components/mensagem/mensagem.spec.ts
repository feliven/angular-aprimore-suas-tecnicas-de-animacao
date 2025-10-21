import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Mensagem } from "./mensagem";

describe("MensagemComponent", () => {
  let component: Mensagem;
  let fixture: ComponentFixture<Mensagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mensagem],
    }).compileComponents();

    fixture = TestBed.createComponent(Mensagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
