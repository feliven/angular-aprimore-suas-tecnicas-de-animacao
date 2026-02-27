import { RouterModule } from '@angular/router';
import { TestBed } from "@angular/core/testing";
import { App } from "./app";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [App, RouterModule],
}).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title '2806-memorando'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("2806-memorando");
  });

  it("should render title", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector(".content span")?.textContent).toContain("2806-memorando app is running!");
  });
});
