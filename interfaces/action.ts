import { Message, Language } from "./index";

export type ActionType = "READ" | "INTERACT" | "DO_NOTHING";

export interface Action {
  message: Message;
  language: Language;
  actionType: ActionType;
}
