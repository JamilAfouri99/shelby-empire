export const CHARACTERS = [
  "Tommy Shelby",
  "Arthur Shelby",
  "Polly Gray",
  "Alfie Solomons",
  "Ada Shelby",
  "Michael Gray",
  "John Shelby",
  "Lizzie Shelby",
  "Aberama Gold",
  "Inspector Campbell",
  "Luca Changretta",
  "Oswald Mosley",
  "Jessie Eden",
  "May Carleton",
  "Grace Shelby",
  "Curly",
  "Charlie Strong",
  "Finn Shelby",
  "Billy Kimber",
] as const;

export type Character = (typeof CHARACTERS)[number];
