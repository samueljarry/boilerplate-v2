import Handlebars from 'handlebars';
import fs from 'fs'
import { pathFromRoot } from "./getPathFromRoot";
import { splitByMethodBody } from "./splitByMethodBody";

export const writeInitializationInsideInitCommand = (
    initCommandFile: string,
    params: {
      methodToInjectIn: string;
      templatePath: string;
      params: {}
    }
  ) => {
    const initCommandPath = pathFromRoot(
      "src/commands/inits",
      initCommandFile
    );

    let content = fs.readFileSync(initCommandPath, "utf-8");
    const [before, after] = splitByMethodBody(params.methodToInjectIn, content);
    
    const templateSource = fs.readFileSync(params.templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    const templateContent = template(params.params);
    
    const [importLine, initLine] = templateContent.split("-");
    const newFile = importLine + before + initLine + "\n  " + after;
    fs.writeFileSync(initCommandPath, newFile, "utf-8");
  }