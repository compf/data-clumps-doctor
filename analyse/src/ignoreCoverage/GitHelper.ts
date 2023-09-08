import simpleGit, {DefaultLogFields, LogResult, SimpleGit, TagResult} from "simple-git";

export class GitHelper {

    static async checkoutGitCommit(path_to_project, commit){
        console.log("Start checkoutGitCommit "+commit);
        const git: SimpleGit = simpleGit(path_to_project);
        try {
            await git.checkout(commit);
        } catch (error) {
            console.error(`Error checking out commit ${commit}:`, error);
            throw new Error(`Failed to checkout commit ${commit}`);
        }
    }

    static async getProjectName(path_to_folder: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.listRemote(['--get-url'], (err: Error | null, data?: string) => {
                if (err) {
                    //reject(err);
                    resolve(null);
                } else {
                    let url = data?.trim();
                    let splitData = url?.split('/');
                    let projectName = splitData?.[splitData.length - 1]?.replace('.git', '') || '';
                    resolve(projectName);
                }
            });
        });
    }

    static async getProjectCommit(path_to_folder: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.revparse(['HEAD'], (err: Error | null, data?: string) => {
                if (err) {
                    //reject(err);
                    resolve(null);
                } else {
                    let commit = data?.trim();
                    if(!!commit){
                        resolve(commit);
                    } else {
                        resolve(null);
                    }

                }
            });
        });
    }

    // New function to get all commits
    static async getAllCommitsFromGitProject(path_to_folder: string): Promise<string[] | null> {
        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.log(undefined, (err: Error | null, log: LogResult<string>) => {
                if (err) {
                    resolve(null);
                } else {

                    git.log(undefined, (err: Error | null, log: LogResult<DefaultLogFields>) => {
                        if (err) {
                            resolve(null);
                        } else {
                            const commits: string[] = [];
                            log.all.forEach(entry => {
                                if(entry.hash) {
                                    commits.push(entry.hash);
                                }
                            });
                            resolve(commits);
                        }
                    });
                }
            });
        });
    }

    static async getAllTagsFromGitProject(path_to_folder: string): Promise<string[] | null> {
        console.log("getAllTagsFromGitProject");
        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.tags(async (err: Error | null, tags: TagResult) => {
                if (err) {
                    resolve(null);
                } else {
                    const commitHashes: string[] = [];
                    for (const tag of tags.all) {
                        try {
                            const details = await git.show([tag]);
                            const hash = details.split('\n')[0].split(' ')[1];
                            commitHashes.push(hash);
                        } catch (error) {
                            console.error(`Error retrieving commit hash for tag ${tag}:`, error);
                        }
                    }
                    console.log("commitHashes")
                    console.log(commitHashes);
                    resolve(commitHashes);
                }
            });
        });
    }

}
