import { DateTime } from "i18n-js/typings";

export interface LoginDetails {
    id:number;
    inTime: DateTime | null;
    outTime: DateTime | null;
    comments: string;
    latitude: number;
    longitude: number;
  }