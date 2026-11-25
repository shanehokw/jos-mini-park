import { defineDialogue } from "../types";

export default defineDialogue({
  start: {
    text: ["Ribbit! Oh, hello there.", "I don't think I've seen you around the park before."],
    choices: [
      { label: "I just moved in!", next: "newHere" },
      { label: "Just passing through.", next: "passing" },
    ],
  },
  newHere: {
    text: "Wonderful! Welcome, welcome. The trees here are great for napping under.",
    choices: [
      { label: "Any other tips?", next: "tips" },
      { label: "Thanks, bye!" },
    ],
  },
  tips: {
    text: ["Read the signpost by the path.", "And never, ever trust a duck."],
  },
  passing: {
    text: "Suit yourself. Ribbit.",
  },
});
