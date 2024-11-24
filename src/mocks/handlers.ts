import { bookHandlers } from "./bookHandlers";
import { recommendationHandlers } from "./recommendationHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [
  ...bookHandlers,
  ...userHandlers,
  ...recommendationHandlers,
];
