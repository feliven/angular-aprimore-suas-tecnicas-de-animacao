import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";
import { transform } from "happy-dom/lib/PropertySymbol";

export const highlightedStateTrigger = trigger("highlightedState", [
  state(
    "default",
    style({
      border: "2px solid #B2B6FF",
    }),
  ),
  state(
    "highlighted",
    style({
      border: "4px solid #B2B6FF",
      filter: "brightness(104%)",
    }),
  ),
  transition("default => highlighted", [
    animate(
      "250ms cubic-bezier(.63,.14,.6,1.35)",
      style({
        transform: "scale(1.01)",
      }),
    ),
    // style({
    //   transform: "scale(1.02)",
    // }),
    // animate(200),
  ]),
]);

export const shownStateTrigger = trigger("shownState", [
  //   state("notShown", style({})),
  // state("shown", style({})),
  transition(":enter", [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
  transition(":leave", [animate(120, style({ opacity: 0 }))]),
]);

export const botaoCheckTrigger = trigger("checkButton", [
  transition("* => checked", [
    animate("400ms ease-in"),
    style({
      transform: "scale(0.4)",
    }),
  ]),
]);

// código omitido

export const filterTrigger = trigger("filterAnimation", [
  transition(":enter", [
    style({ opacity: 0, width: 0 }),
    animate(
      "900ms cubic-bezier(0.25, 1, 0.5, 1)",
      keyframes([
        style({ offset: 0, opacity: 0, width: 0, backgroundColor: "yellow" }),
        style({ offset: 0.9, opacity: 0.5, width: "*", backgroundColor: "yellow" }),
        style({ offset: 1, opacity: 1, width: "*", backgroundColor: "*" }),
      ]),
    ),
  ]),
  transition(":leave", [animate("500ms cubic-bezier(0.16, 1, 0.3, 1)", style({ opacity: 0, width: 0 }))]),
]);

export const formButtonTrigger = trigger("formButton", [
  transition("invalid => valid", [
    animate(
      300,
      style({
        backgroundColor: "#63B77C",
      }),
    ),
    animate(
      100,
      style({
        transform: "scale(1.8)",
      }),
    ),
    animate(
      300,
      style({
        transform: "scale(1)",
      }),
    ),
  ]),
]);
