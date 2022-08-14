import ItemNotSetException from "./ItemNotSetException";

export default class ExceptionFactory {
  static itemNotSet(message?: string) {
    throw new ItemNotSetException(message);
  }
}
