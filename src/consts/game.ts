export interface ActivityEntry {
  id: string;
  kind: "asked" | "answered-yes" | "answered-no" | "prompt";
  actor: "you" | "opponent" | "system";
  text: string;
  time: string;
}
