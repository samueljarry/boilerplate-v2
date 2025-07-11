import Handlebars from "handlebars";
import fs from 'fs';

export const createNewFile = (
  path: string,
  params: {
    templatePath: string;
    params: {}
  }
) => {
  const templateSource = fs.readFileSync(params.templatePath, "utf-8");

  const template = Handlebars.compile(templateSource);
  const content = template(params.params);

  const fileExists = fs.existsSync(path);
  if (fileExists) {
    throw new Error(`
        Scene file already exists at path: "${path}".
        Aborting to prevent overwriting an existing scene.
      `);
  }

  fs.writeFileSync(path, content, { encoding: "utf-8" });
}