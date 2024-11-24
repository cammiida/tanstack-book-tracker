import { bookHandlers } from "./bookHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [...bookHandlers, ...userHandlers];
