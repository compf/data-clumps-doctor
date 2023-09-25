#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import {Command} from 'commander';
import {Analyzer} from "./Analyzer"; // import commander

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const program = new Command();

const path_to_ast_generator_folder_test = __dirname+"/astGenerator";
console.log("path_to_ast_generator_folder_test: "+path_to_ast_generator_folder_test)

const current_working_directory = process.cwd();

program
    .description('Data-Clumps Detection\n\n' +
        'This script performs data clumps detection in a given directory.\n\n' +
        'npx data-clumps-doctor [options] <path_to_folder>')
    .version(version)
    .argument('<path_to_project>', 'Absolute path to project (a git project in best case)')
    .option('--path_to_ast_generator_folder', 'Absolute path to the ast generator folder (In this project: astGenerator)', path_to_ast_generator_folder_test)
    .option('--source <path_to_source_folder>', 'Absolute path to source files (default is the path to project). If you want to analyse just a specific folder in the project, you can specify it here.')
    .option('--source_type <type>', 'Source type (default: java, options: java, uml). uml: Class Diagram in the simple XML Export format of Visual Paradigm.', "java")
    .option('--ast_output <path_to_ast_output>', 'Path where to save the generated AST output. By default it is in a temp folder', current_working_directory+'/'+"temp_ast_output")
    .option('--preserve_ast_output <preserve_ast_output>', 'If the ast_output folder should be preserved (default: false).', false)
    .option('--language <type>', 'Language (default: java, options: java)', "java")
    .option('--verbose', 'Verbose output', false)
    .option('--progress', 'Show progress', true)  // Default value is true
    .option('--output <path>', 'Output path', current_working_directory+'/data-clumps-results/'+Analyzer.project_name_variable_placeholder+'/'+Analyzer.project_commit_variable_placeholder+'.json') // Default value is './data-clumps.json'
    .option('--project_name <project_name>', 'Project Name (default: Git-Name)')
    .option('--project_url <project_url>', 'Project URL (default: Git-Repo-URL)')
    .option('--project_version <project_version>', 'Project Version (default: Git-Commit hash)')
    .option('--project_commit <project_commit>', 'Project Commit (default: current Git-Commit hash)')
    .option('--commit_selection <mode>', 'Commit selections (default: current, options: history, tags, "commit_hash1,commit_hash2,...")')
// TODO: --detector_options <path_to_detector_options_json>

program.parse(process.argv);

// Get the options and arguments
const options = program.opts();
const path_to_project = program.args[0] || './';
const path_to_ast_generator_folder = options.path_to_ast_generator_folder;
const source_type = options.source_type;

if (!fs.existsSync(path_to_ast_generator_folder)) {
    console.log("ERROR: Specified path to ast generator folder does not exist: "+path_to_ast_generator_folder);
    process.exit(1);
}

const path_to_source = options.source || path_to_project;
const path_to_ast_output = path.resolve(options.ast_output);
console.log("path_to_ast_output: "+path_to_ast_output);
let path_to_output_with_variables = options.output;

let project_version = options.project_version;
let preserve_ast_output = options.preserve_ast_output;


const commit_selection_mode = options.commit_selection;

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


async function main() {
    console.log("Data-Clumps-Doctor Detection");

    let passed_project_name = options.project_name;
    let passed_project_url = options.project_url;

    let analyzer = new Analyzer(
        path_to_project,
        path_to_ast_generator_folder,
        path_to_output_with_variables,
        path_to_source,
        source_type,
        path_to_ast_output,
        commit_selection_mode,
        passed_project_url,
        passed_project_name,
        project_version,
        preserve_ast_output
    );

    await analyzer.start()
}

main();

