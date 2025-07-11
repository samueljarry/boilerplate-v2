import Handlebars from 'handlebars';
import fs from 'fs';

export const fillTemplate = (templatePath: string, params: Record<string, unknown>) => {
  const templateSource = fs.readFileSync(templatePath, "utf-8");

  const template = Handlebars.compile(templateSource);
  const content = template(params);

  return content;
}