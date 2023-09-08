import fs from 'fs';
import path from "path";
import {Analyzer} from "./Analyzer";

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

async function main() {
    console.log("Development started");

    const path_to_folder_of_parsed_ast = "./../testDataParsedAst";
    const path_to_ast_generator_folder = "./../astGenerator";
    let path_to_project = "./../astGenerator/testSrc/java";
    path_to_project = "/Users/nbaumgartner/Desktop/LCSD-Paper/Data_for_Paper/ArgoUML_src/src/argouml-app/src"
    //path_to_project = "/Users/nbaumgartner/Documents/GitHub/data-clumps-doctor/astGenerator"
    let path_to_source_folder = path_to_project;
    let path_to_ast_output = "./../temp_ast_output";
    let commits_to_analyse = "current";
    let project_name = "data-clumps-doctor-development";
    let project_version = "development";

    let path_to_output_with_variables = "./../data-clumps-results.json";

    let analyzer = new Analyzer(
        path_to_project,
        path_to_ast_generator_folder,
        path_to_output_with_variables,
        path_to_source_folder,
        path_to_ast_output,
        commits_to_analyse,
        project_name,
        project_version,
    );

    await analyzer.start()
}

main();
