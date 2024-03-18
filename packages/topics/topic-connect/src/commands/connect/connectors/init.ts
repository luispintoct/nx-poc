import { Args, Command } from "@oclif/core";
import { ConnectConnectorsService } from "@commercetools-cli/services-connect";
import { ConnectContentService } from "@commercetools-cli/services-content";
import { select } from "@inquirer/prompts";

export default class ConnectConnectorsInitCommand extends Command {
  static description =
    "Connect command to initialize a connector based on a template";

  static args = {
    destination: Args.string({
      name: "destination",
      required: true,
      description: "destination folder path",
      hidden: false,
      default: undefined,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(ConnectConnectorsInitCommand);

    const connectContentService = new ConnectContentService(
      __dirname + "/../../../../../../../content",
    );

    const templates = await connectContentService.getTemplates();
    const chosenTemplateKey = await select({
      message: "Select a template:",
      choices: templates.map((template) => ({
        name: template.title,
        value: template.key,
        description: template.title,
      })),
    });

    const chosenTemplate = templates.find((t) => t.key === chosenTemplateKey);

    if (chosenTemplate == null) {
      throw new Error("Chosen template not found.");
    }

    const connectService = new ConnectConnectorsService();
    await connectService.init({
      ...chosenTemplate.repository,
      destination: args.destination,
    });
  }
}
