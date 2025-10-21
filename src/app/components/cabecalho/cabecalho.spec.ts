import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Cabecalho } from "./cabecalho";

describe("CabecalhoComponent", () => {
  let component: Cabecalho;
  let fixture: ComponentFixture<Cabecalho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cabecalho],
    }).compileComponents();

    fixture = TestBed.createComponent(Cabecalho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
