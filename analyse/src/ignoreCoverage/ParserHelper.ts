import {SoftwareProjectDicts} from "./SoftwareProject";

import fs from 'fs';
import path from 'path';
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";

import {exec, spawn} from 'child_process';


export class ParserHelper {

    static async execAsync(command): Promise<{ stdout: string, stderr: string }> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ stdout, stderr });
            });
        });
    };

    static async parseSourceCodeToAst(path_to_source_code: string, path_to_save_parsed_ast: string, path_to_ast_generator_folder): Promise<void> {
        console.log("Started generating ASTs");
        try {
            const { stdout } = await ParserHelper.execAsync('cd '+path_to_ast_generator_folder+' && make run SOURCE='+path_to_source_code+' DESTINATION='+path_to_save_parsed_ast);
            console.log(stdout);
        } catch (error) {
            console.error(`Error executing make: ${error}`);
        }
        console.log("Finished generating ASTs");
    }

    static async removeGeneratedAst(path_to_folder_of_parsed_ast: string): Promise<void> {
        console.log("Started removing generated ASTs");
        // delete file if exists
        if(fs.existsSync(path_to_folder_of_parsed_ast)){
            fs.rmSync(path_to_folder_of_parsed_ast, { recursive: true });
        }
    }

    static async getDictClassOrInterfaceFromParsedAstFolder(path_to_folder_of_parsed_ast){
        let softwareProjectDicts: SoftwareProjectDicts = new SoftwareProjectDicts();

        let filesAndFoldersInPath = fs.readdirSync(path_to_folder_of_parsed_ast, { withFileTypes: true });
        for (let fileOrFolder of filesAndFoldersInPath) {
            let fullPath = path.join(path_to_folder_of_parsed_ast, fileOrFolder.name);
            if (fileOrFolder.isDirectory()) {
                continue;
            } else {
                let fileContent = fs.readFileSync(fullPath, 'utf-8');
                const loadedJsonData: any = JSON.parse(fileContent); // Parse the JSON data
                const classOrInterfaceTypeContext: ClassOrInterfaceTypeContext = ClassOrInterfaceTypeContext.fromObject(loadedJsonData);
                softwareProjectDicts.loadClassOrInterface(classOrInterfaceTypeContext);
            }
        }

        return softwareProjectDicts
    }

}
