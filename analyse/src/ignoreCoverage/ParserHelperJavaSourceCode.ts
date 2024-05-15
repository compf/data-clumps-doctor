import {exec, spawn} from 'child_process';


export class ParserHelperJavaSourceCode {

    static async execAsync(command): Promise<{ stdout: string, stderr: string }> {
        return new Promise((resolve, reject) => {
           //spawn(command, { shell: true ,stdio:"inherit"});
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
            const { stdout } = await ParserHelperJavaSourceCode.execAsync('cd '+path_to_ast_generator_folder+' && make run SOURCE="'+path_to_source_code+'" DESTINATION="'+path_to_save_parsed_ast+'"');
            console.log(stdout);
        } catch (error) {
            console.error(`Error executing make: ${error}`);
        }
    console.log("Finished generating ASTs");
    }



}
