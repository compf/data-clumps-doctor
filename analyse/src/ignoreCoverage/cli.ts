#!/usr/bin/env node

import simpleGit, {SimpleGit} from 'simple-git';

import fs from 'fs';
import path from 'path';
import {Detector} from "./detector/Detector";

import {Command} from 'commander';
import {SoftwareProjectDicts} from "./SoftwareProject";
import {GitHelper} from "./GitHelper";
import {Analyzer} from "./Analyzer"; // import commander

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const program = new Command();



program
    .description('Data-Clumps Detection\n\n' +
        'This script performs data clumps detection in a given directory.\n\n' +
        'npx data-clumps-doctor [options] <path_to_folder>')
    .version(version)
    .argument('<path_to_project>', 'Absolute path to project (a git project in best case)')
    .argument('<path_to_ast_generator_folder>', 'Absolute path to the ast generator folder (In this project: astGenerator)')
    .option('--source <path_to_source_folder>', 'Absolute path to source files (default is the path to project). If you want to analyse just a specific folder in the project, you can specify it here.')
    .option('--ast_output <path_to_ast_output>', 'Path where to save the generated AST output', "./temp_ast_output")
    .option('--language <type>', 'Language (default: java, options: java)', "java")
    .option('--verbose', 'Verbose output', false)
    .option('--progress', 'Show progress', true)  // Default value is true
    .option('--output <path>', 'Output path', './data-clumps-results/'+Analyzer.project_name_variable_placeholder+'/'+Analyzer.project_commit_variable_placeholder+'.json') // Default value is './data-clumps.json'
    .option('--project_name <project_name>', 'Project Name (default: Git-Name)')
    .option('--project_version <project_version>', 'Project Version (default: Git-Commit hash)')
    .option('--project_commit <project_commit>', 'Project Commit (default: current Git-Commit hash)')
    .option('--commit_selection <mode>', 'Commit selections (default: current, options: history, tags, "commit_hash1,commit_hash2,...")')
// TODO: --detector_options <path_to_detector_options_json>

program.parse(process.argv);

// Get the options and arguments
const options = program.opts();
const path_to_project = program.args[0] || './';
const path_to_ast_generator_folder = program.args[1];

if (!fs.existsSync(path_to_ast_generator_folder)) {
    console.log("ERROR: Specified path to ast generator folder does not exist: "+path_to_ast_generator_folder);
    process.exit(1);
}

const path_to_source_folder = options.source || path_to_project;
const path_to_ast_output = options.ast_output;
let path_to_output_with_variables = options.output;

let project_version = options.project_version;


const commitSelectionMode = options.commit_selection;




async function getCommitSelectionModeCurrent(){
    let commits_to_analyse: any[] = [];
    let commit = await GitHelper.getProjectCommit(path_to_project);
    if(!!options.project_commit){
        commit = options.project_commit;
    }
    if(!commit){
        commit = null;
    }
    commits_to_analyse.push(commit);
    return commits_to_analyse;
}

async function getNotAnalysedGitTagCommits(project_name){
    console.log("Perform a full check of the whole project");
    const allCommits = await GitHelper.getAllTagsFromGitProject(path_to_project);
    let missing_commit_results: string[] = [];

    if(!!allCommits){
        console.log("ammount tag commits: "+allCommits.length)

        for (const commit of allCommits) {
            console.log("check commit: " + commit);
            let path_to_output = Analyzer.replaceOutputVariables(path_to_output_with_variables, project_name, commit);

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

async function getProjectName(path_to_folder: string): Promise<string> {
    if(!!options.project_name){
        return options.project_name;
    }

    let project_name = await GitHelper.getProjectName(path_to_folder);
    if(!project_name){
        project_name = "unknown_project_name";
    }
    return project_name;
}

function printLogo(){
    console.log("                                                                                                    \n" +
        "                                                                                                    \n" +
        "                                                                                                    \n" +
        "                        :~!777?77!~:..        ..::::..        ..:~!77?777!~:                        \n" +
        "                       .?JJJJJ???JJJ7:  ..^!?Y55PPPP55Y?!^..  :7JJJ???JJJJJ?.                       \n" +
        "                       ~JJJJ7.....:. .^?5PGGPPPPPPPPPPPPGGP5?^. .:.....7JJJJ~                       \n" +
        "                       ~JJJ?.      :?Y?!~~75PPPPPPPPPPPP57~~!?Y?:      .?JJJ~                       \n" +
        "                  .^?. :JJJ7     :?7:.^~77.^PPPPPPPPPPPP^.77~^.:7?:     7JJJ: .?^.                  \n" +
        "                 ~Y5P?  !JJ?.   ~J::?5PPY?..5PPPPPPPPPP5..?YPP5?::J~   .?JJ!  ?P5Y~                 \n" +
        "               .JGJ..^^ .7JJ^  !Y:7PPPY777JYPPPPPPPPPPPPY?777YPPP7:Y!  ^JJ7. ^^..JGJ.               \n" +
        "              .YPPP5J:~^ .~: .7G~?GPP55PGPPPPPPPPPPPPPPPPPPGP55PPG?~G7. :~. ^~:J5PPPY.              \n" +
        "              ?GP!:^J5!P!   ~5PP5P5^...:7PPPPPPPPPPPPPPPPPP7:...^5P5PP5~   !P!5J^:!PG?              \n" +
        "             :PP~   .5P5: .JPPPPPP^      7GPY7!~^^^^~!7YPG7      ^PPPPPPJ. :5P5.   ~PP:             \n" +
        "          !^ ~PP~   ~P5: :5PPPPPPP?.    :J!:.          .:!J:    .?PPPPPPP5: :5P~   ~PP~ ^!          \n" +
        "      ::.~J! .5PP?!JPP~ .YPPPPPPPPP5J77YJ..7?~::. ..::~?7..JY77J5PPPPPPPPPY. ~PPJ!?PP5. !J~.::      \n" +
        "      .J?JJ?: ^5GGGPPP. ^PPPPPPPPPPPGGP?. 7J?JJJJ.:JJJJ?J7 .?PGGPPPPPPPPPPP^ .PPPGGG5^ :?JJ?J.      \n" +
        "     .!JJJJJ?: .~J5PPP. ^PPPPPPPPPPPJ~. .!JJ7~~!^..~!~~7JJ!. .~JPPPPPPPPPPP^ .PPP5J~. :?JJJJJ!.     \n" +
        "     .?JJJJJJJ7^. .::^. .5PPPPPPPPY^ .^7JJJJJ?7!!??!!7?JJJJJ7^. ^YPPPPPPPP5. .^::. .^7JJJJJJJ?.     \n" +
        "      .7JJJJJJJJJ7!~^^^. ^PPPPPPPY. ^JJJJJJJJJJJJJJJJJJJJJJJJJJ^ .YPPPPPPP^ .^^^~!7JJJJJJJJJ7.      \n" +
        "       :~!7???JJJJJJJJJ7. ^5PPPPP! .?JJJJJJJJJJJJJJJJJJJJJJJJJJ?. !PPPPP5^ .7JJJJJJJJJ???7!~:       \n" +
        "       .7??7??JJJJJJJJJJ7: .75PPP?  !JJJJJJJJJJJJJJJJJJJJJJJJJJ!  ?PPP57. :7JJJJJJJJJJ??7??7.       \n" +
        "        .~?JJJJJJJJJJJJJJJ~. .!YPP~ .!JJJJJJJJJJJJJJJJJJJJJJJJ!. ~PPY!. .~JJJJJJJJJJJJJJJ?~.        \n" +
        "          .^!?JJJJJJJJJJJJJJ!:. :!J!. :7JJJJJJJJJJJJJJJJJJJJ7: .!J!: .:!JJJJJJJJJJJJJJ?!^.          \n" +
        "             .:^~77??JJJJJJJJ?7^.  ..   :!?JJJJJJJJJJJJJJ?!:   ..  .^7?JJJJJJJJ??77~^:.             \n" +
        "                   ............ ..:~^.     .^^~~!!!!~~^^.     .^~:. .............                   \n" +
        "                                .:!?: :~ !?~^::......::^~??.:: :?~.                                 \n" +
        "                                   . :J^.B#####BBBBBB######:.J:                                     \n" +
        "                                    .?J! Y################P.^J?.                                    \n")
}

async function getNotAnalysedGitCommits(project_name){
    console.log("Perform a full check of the whole project");
    const allCommits = await GitHelper.getAllCommitsFromGitProject(path_to_project);
    let missing_commit_results: string[] = [];

    if(!!allCommits){
        console.log("amount commits: "+allCommits.length)

        for (const commit of allCommits) {
            console.log("check commit: " + commit);
            let path_to_output = Analyzer.replaceOutputVariables(path_to_output_with_variables, project_name, commit);

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

async function main() {
    console.log("Data-Clumps-Doctor Detection");

    console.log("path_to_project: "+path_to_project);
    let project_name = await getProjectName(path_to_project);
    console.log("project_name: "+project_name);

    let commits_to_analyse: any[] = [];
    let git_checkout_needed = true;

    if(commitSelectionMode==="current" || !commitSelectionMode){
        commits_to_analyse = await getCommitSelectionModeCurrent();
        git_checkout_needed = false;
    } else if(commitSelectionMode==="full"){
        commits_to_analyse = await getNotAnalysedGitCommits(project_name);
    } else if(commitSelectionMode==="tags"){
        commits_to_analyse = await getNotAnalysedGitTagCommits(project_name);
    } else {
        let string_commits_to_analyse = commitSelectionMode;
        commits_to_analyse = string_commits_to_analyse.split(",");
    }

    let analyzer = new Analyzer(
        path_to_project,
        path_to_ast_generator_folder,
        path_to_output_with_variables,
        path_to_source_folder,
        path_to_ast_output,
        commits_to_analyse,
        git_checkout_needed,
        project_name,
        project_version,
    );

    await analyzer.start()
}

main();

