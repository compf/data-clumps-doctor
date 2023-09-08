import {GitHelper} from "./GitHelper";
import fs from "fs";
import {SoftwareProjectDicts} from "./SoftwareProject";
import {Detector} from "./detector/Detector";
import {ParserHelper} from "./ParserHelper";
import {Timer} from "./Timer";
import path from "path";

const current_working_directory = process.cwd();

export class Analyzer {

    public static project_name_variable_placeholder ="{project_name}";
    public static project_commit_variable_placeholder ="{project_commit}";


    public path_to_project: string;
    public path_to_ast_generator_folder: string;
    public path_to_output_with_variables: string;
    public path_to_source_folder: string;
    public path_to_ast_output: string;
    public commit_selection_mode: string | undefined | null;
    public project_name: string = "unknown_project_name";
    public project_version: any;

    public passed_project_name: string | undefined | null;

    public timer: Timer;

    constructor(
        path_to_project: string,
        path_to_ast_generator_folder: string,
        path_to_output_with_variables: string,
        path_to_source_files: string,
        path_to_ast_output: string,
        commit_selection_mode: string | undefined | null,
        project_name: string | undefined | null,
        project_version: any
    ) {
        this.path_to_project = path_to_project;
        this.path_to_ast_generator_folder = path_to_ast_generator_folder;
        this.path_to_output_with_variables = path_to_output_with_variables
        this.path_to_source_folder = path_to_source_files;
        this.path_to_ast_output = path_to_ast_output;
        this.commit_selection_mode = commit_selection_mode;
        this.passed_project_name = project_name;
        this.project_version = project_version;

        this.timer = new Timer();
    }

    public async getCommitSelectionModeCurrent(){
        let commits_to_analyse: any[] = [];
        let commit = await GitHelper.getProjectCommit(this.path_to_project);
        if(!commit){
            commit = null;
        }
        commits_to_analyse.push(commit);
        return commits_to_analyse;
    }

    async getNotAnalysedGitCommits(){
        console.log("Perform a full check of the whole project");
        const allCommits = await GitHelper.getAllCommitsFromGitProject(this.path_to_project);
        let missing_commit_results: string[] = [];

        if(!!allCommits){
            console.log("amount commits: "+allCommits.length)

            for (const commit of allCommits) {
                console.log("check commit: " + commit);
                let path_to_output = Analyzer.replaceOutputVariables(this.path_to_output_with_variables, this.project_name, commit);

                // Check if output file already exists for the commit
                if (!fs.existsSync(path_to_output)) {
                    missing_commit_results.push(commit);
                }
            }
        } else {
            console.log("No commits found");
        }
        return missing_commit_results;
    }

    async getNotAnalysedGitTagCommits(){
        console.log("Perform a full check of the whole project");
        const allCommits = await GitHelper.getAllTagsFromGitProject(this.path_to_project);
        let missing_commit_results: string[] = [];

        if(!!allCommits){
            console.log("ammount tag commits: "+allCommits.length)

            for (const commit of allCommits) {
                console.log("check commit: " + commit);
                let path_to_output = Analyzer.replaceOutputVariables(this.path_to_output_with_variables, this.project_name, commit);

                // Check if output file already exists for the commit
                if (!fs.existsSync(path_to_output)) {
                    missing_commit_results.push(commit);
                }
            }
        } else {
            console.log("No tag commits found");
        }
        return missing_commit_results;
    }

    public async configureCommitSelectionMode(): Promise<{ git_checkout_needed: boolean; commits_to_analyse: any[] }> {
        let git_checkout_needed = true;
        let commits_to_analyse: any[] = [];
        if(this.commit_selection_mode==="current" || !this.commit_selection_mode){
            commits_to_analyse = await this.getCommitSelectionModeCurrent();
            git_checkout_needed = false;
        } else if(this.commit_selection_mode==="full"){
            commits_to_analyse = await this.getNotAnalysedGitCommits();
        } else if(this.commit_selection_mode==="tags"){
            commits_to_analyse = await this.getNotAnalysedGitTagCommits();
        } else {
            let string_commits_to_analyse = this.commit_selection_mode;
            commits_to_analyse = string_commits_to_analyse.split(",");
        }
        return {
            git_checkout_needed: git_checkout_needed,
            commits_to_analyse: commits_to_analyse
        }
    }

    async loadProjectName(path_to_folder: string): Promise<string> {
        if(!!this.passed_project_name){ // if project name was passed as parameter
            return this.passed_project_name; // use passed project name
        }

        let project_name = await GitHelper.getProjectName(path_to_folder);
        if(!project_name){ // if no project name could be found in the git repository
            project_name = this.project_name // use default project name
        }
        return project_name;
    }

    async start(){
        this.timer.start();

        this.project_name = await this.loadProjectName(this.path_to_project);
        let {
            git_checkout_needed,
            commits_to_analyse
        } = await this.configureCommitSelectionMode();

        if(git_checkout_needed){
            let i=1;
            let amount_commits = commits_to_analyse.length;
            console.log("Analysing amount commits: "+amount_commits);
            const commitInformation = "Commit ["+i+"/"+amount_commits+"]";
            console.log("Analyse "+commitInformation);
            for (const commit of commits_to_analyse) {
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
            let commit = !!(commits_to_analyse && commits_to_analyse.length===1) ? commits_to_analyse[0] : undefined;
            await this.analyse(commit);
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

            const dir = path.dirname(path_to_result);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
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
