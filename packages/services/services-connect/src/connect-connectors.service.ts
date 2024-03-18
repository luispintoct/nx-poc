import { GitService } from "@commercetools-cli/services-git";

class ConnectConnectorsService {
  private gitService: GitService;

  constructor() {
    this.gitService = new GitService();
  }

  async init(options: {
    source: "github";
    user: string;
    name: string;
    path?: string;
    destination: string;
  }): Promise<void> {
    await this.gitService.clone(options);
  }
}

export { ConnectConnectorsService };
