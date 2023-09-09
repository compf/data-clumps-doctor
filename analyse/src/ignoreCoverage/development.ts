import fs from 'fs';
import path from "path";
import {Analyzer} from "./Analyzer";

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const current_working_directory = process.cwd();

async function main() {
    console.log("Development started");

    const path_to_ast_generator_folder = current_working_directory+"/src/ignoreCoverage/astGenerator";
    let path_to_project = path_to_ast_generator_folder+"/testSrc/java";
    path_to_project = "/Users/nbaumgartner/Desktop/LCSD-Paper/Data_for_Paper/ArgoUML_src/src/argouml-app"
    let path_to_source_folder = path_to_project;
    let path_to_ast_output = current_working_directory+'/'+"temp_ast_output"
    let commits_to_analyse = "current";
    let project_name = "data-clumps-doctor-development";
    let project_version = "development";

    let path_to_output_with_variables = current_working_directory+"/data-clumps-results.json";

    let analyzer = new Analyzer(
        path_to_project,
        path_to_ast_generator_folder,
        path_to_output_with_variables,
        path_to_source_folder,
        path_to_ast_output,
        commits_to_analyse,
        project_name,
        project_version,
        false,
    );

    await analyzer.start()
}

main();
