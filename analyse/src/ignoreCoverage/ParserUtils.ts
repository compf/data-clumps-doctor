import {SoftwareProjectDicts} from "./SoftwareProject";

import fs from 'fs';
import path from 'path';
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";

export class ParserUtils {

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
