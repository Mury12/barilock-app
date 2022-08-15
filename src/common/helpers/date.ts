import moment from "moment";

export function date(date: string) {
  return date ? moment(date).format("DD/MM/Y, H:m") : '-';
}
