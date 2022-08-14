import { AxiosClient } from "./AxiosClient";
import { ws } from "@/../ws-routes";
import { LocalStorage } from "./LocalStorage";

class ApiClient extends AxiosClient {
  constructor() {
    super({
      baseURL: ws.URL,
    });
  }
  public async login(username: string, password: string) {
    const { data: result } = await this.post<any>(ws.USER.LOGIN, {
      username,
      password,
    });
    LocalStorage.set("user", JSON.stringify(result)).set(
      "token",
      JSON.stringify(result.token)
    );
    this.api.defaults.headers.Authorization = result.token;
    return result;
  }

  done() {
    LocalStorage.remove("token").remove("user");
  }
  checkToken() {
    const user = LocalStorage.get<any>("user");
    if (user) {
      return {
        authenticated: true,
        user: JSON.parse(user),
      };
    }
    return false;
  }
}

const apiClient = new ApiClient();
export default apiClient;
