import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";

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
      "2000ms ease-out",
      keyframes([
        style({ offset: 0, opacity: 0, width: 0 }),
        style({ offset: 0.3, opacity: 0.5, width: "*", backgroundColor: "red" }),
        style({ offset: 1, opacity: 1, width: "*", backgroundColor: "yellow" }),
      ]),
    ),
  ]),
  transition(":leave", [animate("500ms cubic-bezier(.13,.9,.8,.1)", style({ opacity: 0, width: 0 }))]),
]);
