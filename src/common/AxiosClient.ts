import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Creates a default Axios client to be used as a request interface,
 * providing the basic methods and configurations.
 *
 * @method get
 * @method delete
 * @method post
 * @method put
 * @method patch
 */
export abstract class AxiosClient {
  protected api: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.api = Axios.create(config);
  }

  /**
   * Performs a `get` request using axios
   * @param url the path or full path (if baseUrl is not defined)
   * @param config axios config
   * @returns
   */
  protected get<T>(url: string, config?: AxiosRequestConfig) {
    return this.api.get<T>(url, config);
  }

  /**
   * Performs a `delete` request using axios
   * @param url the path or full path (if baseUrl is not defined)
   * @param config axios config
   */
  protected delete(url: string, config?: AxiosRequestConfig) {
    return this.api.delete(url, config);
  }

  /**
   * Performs a `post` using axios
   * @param url the path or full path (if baseUrl is not defined)
   * @param data the data to send
   * @param config axios config
   */
  protected post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.api.post<T>(url, data, config);
  }

  /**
   * Performs a `put` using axios
   * @param url the path or full path (if baseUrl is not defined)
   * @param data the data to send
   * @param config axios config
   */
  protected put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.api.put<T>(url, data, config);
  }

  /**
   * Performs a `patch` using axios
   * @param url the path or full path (if baseUrl is not defined)
   * @param data the data to send
   * @param config axios config
   */
  protected patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.api.patch<T>(url, data, config);
  }
}
