import {GitHelper} from "./GitHelper";
import fs from "fs";
import {SoftwareProjectDicts} from "./SoftwareProject";
import {Detector} from "./detector/Detector";
import {ParserHelper} from "./ParserHelper";
import {Timer} from "./Timer";

export class Analyzer {

    public static project_name_variable_placeholder ="{project_name}";
    public static project_commit_variable_placeholder ="{project_commit}";


    public path_to_project: string;
    public path_to_ast_generator_folder: string;
    public path_to_output_with_variables: string;
    public path_to_source_folder: string;
    public path_to_ast_output: string;
    public list_commits_to_analyse: string[] = [];
    public git_checkout_needed: boolean = true;
    public project_name: string;
    public project_version: any;

    public timer: Timer;

    constructor(
        path_to_project: string,
        path_to_ast_generator_folder: string,
        path_to_output_with_variables: string,
        path_to_source_files: string,
        path_to_ast_output: string,
        list_commits_to_analyse: string[],
        git_checkout_needed: boolean,
        project_name: string,
        project_version: any
    ) {
        this.path_to_project = path_to_project;
        this.path_to_ast_generator_folder = path_to_ast_generator_folder;
        this.path_to_output_with_variables = path_to_output_with_variables
        this.path_to_source_folder = path_to_source_files;
        this.path_to_ast_output = path_to_ast_output;
        this.list_commits_to_analyse = list_commits_to_analyse;
        this.git_checkout_needed = git_checkout_needed;
        this.project_name = project_name;
        this.project_version = project_version;

        this.timer = new Timer();
    }


    async start(){
        this.timer.start();
        if(this.git_checkout_needed){
            let i=1;
            let amount_commits = this.list_commits_to_analyse.length;
            console.log("Analysing amount commits: "+amount_commits);
            const commitInformation = "Commit ["+i+"/"+amount_commits+"]";
            console.log("Analyse "+commitInformation);
            for (const commit of this.list_commits_to_analyse) {
                let checkoutWorked = true;
                if(!!commit){
                    try{
                        await GitHelper.checkoutGitCommit(this.path_to_project, commit);
                    } catch(error){
                        checkoutWorked = false;
                    }
                }
                if(checkoutWorked){
                    // Do analysis for each missing commit and proceed to the next
                    await this.analyse(commit);
                    console.log("Proceed to next");
                } else {
                    console.log("Skip since checkout did not worked");
                }
                i++;
            }
        } else {
            await this.analyse(undefined);
        }

        this.timer.stop();
        this.timer.printElapsedTime("Detection time");
    }

    async generateAstCallback(message, index, total): Promise<void> {
        let isEveryHundreds = index % 100 === 0;
        let firstAndSecond = index === 0 || index === 1;
        let lastAndPreLast = index === total - 1 || index === total - 2;
        if(firstAndSecond || isEveryHundreds || lastAndPreLast) {
            let content = `${index}/${total}: ${message}`;
            this.timer.printElapsedTime(null ,content);
        }
    }

    static replaceOutputVariables(path_to_output_with_variables, project_name="project_name", project_commit="project_commit"){
        let copy = path_to_output_with_variables+"";
        copy = copy.replace(Analyzer.project_name_variable_placeholder, project_name);
        copy = copy.replace(Analyzer.project_commit_variable_placeholder, project_commit);
        return copy;
    }


    async analyse(commit){
        let project_version = this.project_version || commit || "unknown_project_version";

        if (!fs.existsSync(this.path_to_source_folder)) {
            console.log(`The path to source files ${this.path_to_source_folder} does not exist.`);
            return;
        } else {
            await ParserHelper.parseSourceCodeToAst(this.path_to_source_folder, this.path_to_ast_output, this.path_to_ast_generator_folder);
            let softwareProjectDicts: SoftwareProjectDicts = await ParserHelper.getDictClassOrInterfaceFromParsedAstFolder(this.path_to_ast_output);

            let detectorOptions = {};
            let progressCallback = this.generateAstCallback.bind(this);
            let detector = new Detector(softwareProjectDicts, detectorOptions, progressCallback, this.project_name, project_version, commit);

            let dataClumpsContext = await detector.detect();
            await ParserHelper.removeGeneratedAst(this.path_to_ast_output);

            let path_to_result = Analyzer.replaceOutputVariables(this.path_to_output_with_variables, this.project_name, commit);

            // delete file if exists
            if(fs.existsSync(path_to_result)){
                fs.unlinkSync(path_to_result);
            }

            // save to file
            try {
                fs.writeFileSync(path_to_result, JSON.stringify(dataClumpsContext, null, 2), 'utf8');
                console.log('JSON data has been successfully saved to file.');
            } catch (err) {
                console.error('An error occurred while writing to file:', err);
            }

        }
    }

}
