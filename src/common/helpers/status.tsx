export function status(statusId: string) {
  return statusId === "open" ? "Em andamento" : "Encerrado";
}
