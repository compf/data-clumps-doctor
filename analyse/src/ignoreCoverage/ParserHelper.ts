import {SoftwareProjectDicts} from "./SoftwareProject";

import fs from 'fs';
import path from 'path';
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";

import {exec, spawn} from 'child_process';


export class ParserHelper {

    static async getSoftwareProjectDictsFromParsedAstFolder(path_to_folder_of_parsed_ast){
        let softwareProjectDicts: SoftwareProjectDicts = new SoftwareProjectDicts();
        //console.log("Started loading ASTs")
        //console.log("path_to_folder_of_parsed_ast", path_to_folder_of_parsed_ast)

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

    static async removeGeneratedAst(path_to_folder_of_parsed_ast: string): Promise<void> {
        //console.log("Started removing generated ASTs");
        // delete file if exists
        let attempts=0;
        const MAX_ATTEMPTS=3;
        let success=false;
        while(fs.existsSync(path_to_folder_of_parsed_ast) && attempts<MAX_ATTEMPTS && !success){
            try{
                fs.rmSync(path_to_folder_of_parsed_ast, { recursive: true,force: true });
                success=true;
            }
            catch (e) {
                attempts++;
                console.log("Failed to remove folder, attempt: ", attempts, "Error:", e);
            }
        }
    }

}
