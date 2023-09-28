#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import {Command} from 'commander';
import {Analyzer} from "./Analyzer";

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;


const program = new Command();

const current_working_directory = process.cwd();

program
    .description('Analyse Detected Data-Clumps\n\n' +
        'This script performs data clumps detection in a given directory.\n\n' +
        'npx data-clumps-doctor [options] <path_to_folder>')
    .version(version)
    .option('--report_folder <path>', 'Output path', current_working_directory+'/data-clumps-results/'+Analyzer.project_name_variable_placeholder+'/') // Default value is './data-clumps.json'
    .option('--output <path>', 'Output path', current_working_directory+'/data-clumps-results/'+Analyzer.project_name_variable_placeholder+'/'+Analyzer.project_commit_variable_placeholder+'.json') // Default value is './data-clumps.json'

function time_stamp_to_file_paths(report_folder){
    let all_report_files = fs.readdirSync(report_folder);
    console.log("Amount of files in folder: "+all_report_files.length);
    let all_report_files_paths: any = [];
    for (let i = 0; i < all_report_files.length; i++) {
        let report_file = all_report_files[i];
        if(report_file.endsWith(".json")){
            let report_file_path = path.join(report_folder, report_file);
            all_report_files_paths.push(report_file_path);
        }
    }
    console.log("Amount of report files: "+all_report_files_paths.length);

    console.log("Reading all report files and extracting data clumps amount per commit date");
    let timestamp_to_file_path = {};
    for(let i = 0; i <all_report_files_paths.length; i++){
        let report_file_path = all_report_files_paths[i];
        let report_file = fs.readFileSync(report_file_path, 'utf8');
        console.log("parsing report file: "+report_file_path+" ...")
        let report_file_json = JSON.parse(report_file);
        let project_commit_date = report_file_json?.project_info?.project_commit_date;
        project_commit_date = parseInt(project_commit_date); // unix timestamp
        console.log("project_commit_date: "+project_commit_date);

        if(timestamp_to_file_path[project_commit_date] === undefined){
            timestamp_to_file_path[project_commit_date] = [report_file_path]
        }
        else{
            timestamp_to_file_path[project_commit_date].push(report_file_path)
        }
    }

    console.log("Amount of timestamps: "+Object.keys(timestamp_to_file_path).length);

    return timestamp_to_file_path;
}

function getSortedTimestamps(timestamp_to_file_path){
    let sorted_timestamps = Object.keys(timestamp_to_file_path).sort();
    return sorted_timestamps;
}

function getAllDataClumpsKeys(sorted_timestamps, timestamp_to_file_path){
    let all_data_clump_keys = {};

    for(let i = 0; i < sorted_timestamps.length; i++){
        let report_file_path = timestamp_to_file_path[sorted_timestamps[i]];

        let report_file = fs.readFileSync(report_file_path, 'utf8');
        let report_file_json = JSON.parse(report_file);

        let data_clumps_dict = report_file_json?.data_clumps;
        let data_clumps_keys = Object.keys(data_clumps_dict);

        // check if data clump key is already in histogram and if not add it
        for(let j = 0; j < data_clumps_keys.length; j++){
            let data_clump_key = data_clumps_keys[j];

            all_data_clump_keys[data_clump_key] = true;
        }
    }

    return all_data_clump_keys;
}

function printHistogram(sorted_timestamps, timestamp_to_file_path){
    let all_data_clump_keys = getAllDataClumpsKeys(sorted_timestamps, timestamp_to_file_path);
    let all_data_clump_keys_list = Object.keys(all_data_clump_keys);
    for(let i = 0; i < all_data_clump_keys_list.length; i++){
        let data_clump_key = all_data_clump_keys_list[i];

        let data_clump_print_string = "|";
        for(let j = 0; j < sorted_timestamps.length; j++){
            let timestamp = sorted_timestamps[j];
            let report_file_path = timestamp_to_file_path[timestamp];

            let report_file = fs.readFileSync(report_file_path, 'utf8');
            let report_file_json = JSON.parse(report_file);

            let data_clumps_dict = report_file_json?.data_clumps;

            let print_string = "";

            if(data_clumps_dict[data_clump_key]){ // data clump key is in current time frame
                print_string = "X";
            } else {
                print_string = " ";
            }
            data_clump_print_string += print_string;
        }
        console.log(data_clump_print_string);
    }
}

function printAmountDataClumpsOverTime(sorted_timestamps, timestamp_to_file_paths){
    for(let i = 0; i < sorted_timestamps.length; i++){
        let report_file_paths = timestamp_to_file_paths[sorted_timestamps[i]];

        for(let j = 0; j < report_file_paths.length; j++){
            let report_file_path = report_file_paths[j];

            let report_file = fs.readFileSync(report_file_path, 'utf8');
            let report_file_json = JSON.parse(report_file);

            let amount_data_clumps = report_file_json?.report_summary?.amount_data_clumps;
            let project_commit_date = parseInt(report_file_json?.project_info?.project_commit_date);
            let project_commit_hash = report_file_json?.project_info?.project_commit_hash;
            let project_tag = report_file_json?.project_info?.project_tag;

            // timestamp to date
            let date = new Date(project_commit_date*1000);
            // date to string
            let date_string = date.toISOString().slice(0,10);


            console.log(project_commit_hash+" - "+date_string+" --> "+amount_data_clumps + " data clumps === "+project_tag);
        }
    }
}

async function analyse(report_folder, options){
    console.log("Analysing Detected Data-Clumps");
    if (!fs.existsSync(report_folder)) {
        console.log("ERROR: Specified path to report folder does not exist: "+report_folder);
        process.exit(1);
    }

    let timestamp_to_file_paths = time_stamp_to_file_paths(report_folder);
    let sorted_timestamps = getSortedTimestamps(timestamp_to_file_paths);
    console.log("sorted_timestamps: "+sorted_timestamps.length);

    //printHistogram(sorted_timestamps, timestamp_to_file_path);
    printAmountDataClumpsOverTime(sorted_timestamps, timestamp_to_file_paths);


}

async function main() {
    console.log("Data-Clumps-Doctor Detection");

    program.parse(process.argv);

    // Get the options and arguments
    const options = program.opts();

    const report_folder = options.report_folder;



    await analyse(report_folder, options);
}

main();

