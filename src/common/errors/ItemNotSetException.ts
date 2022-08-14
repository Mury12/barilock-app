export default class ItemNotSetException extends Error {
  constructor(message?: string) {
    super(message ?? "Precisa selecionar um item.");
  }
}
