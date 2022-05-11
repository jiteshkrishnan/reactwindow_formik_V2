import { atom } from "recoil";

//Used to track and place the modified items
export const modifiedItems = atom({
  key: "results",
  default: {}
});
