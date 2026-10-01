export interface Memory {
  id: string;
  title: string;
  date: string;
  text: string;
  importance: "low" | "normal" | "important" | "life-changing";
  category:
    | "achievement"
    | "adventure"
    | "family"
    | "celebration"
    | "growth"
    | "reflection"
    | "milestone";
  image?: string;
  video?: string;
}