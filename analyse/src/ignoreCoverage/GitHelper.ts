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

    static async getRemoteUrl(path_to_project): Promise<string> {
        console.log("Start getRemoteUrl");
        const git: SimpleGit = simpleGit(path_to_project);
        try {
            const remotes = await git.listRemote(['--get-url']);
            if (remotes) {
                let remoteUrl = remotes.split('\n')[0];  // Assuming the first line contains the URL
                let gitEnding = ".git";
                if(remoteUrl.endsWith(gitEnding)){
                    remoteUrl = remoteUrl.substring(0, remoteUrl.length - gitEnding.length);
                }
                return remoteUrl;
            } else {
                throw new Error('No remote URL found');
            }
        } catch (error) {
            console.error('Error getting remote URL:', error);
            throw new Error('Failed to get remote URL');
        }
    }

    static async getCommitHashForTag(path_to_folder: string, tagName: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.raw(['show-ref', '--tags', tagName], (err: Error | null, data: string) => {
                if (err) {
                    console.error(`Error fetching commit hash for tag ${tagName}:`, err);
                    resolve(null);
                } else {
                    const lines = data.trim().split('\n');
                    for (const line of lines) {
                        const parts = line.split(' ');
                        if (parts.length > 1 && parts[1] === `refs/tags/${tagName}`) {
                            resolve(parts[0]);
                            return;
                        }
                    }
                    console.warn(`No commit hash found for tag ${tagName}`);
                    resolve(null);
                }
            });
        });
    }

    static async getTagFromCommitHash(path_to_folder: string, commitHash: string): Promise<string | null> {
        // 1. get all Tags: GitHelper.getAllTagsFromGitProject(path_to_folder)
        let tags = await GitHelper.getAllTagsFromGitProject(path_to_folder);

        // 2. get all commits for each tag: GitHelper.getCommitsForTag(path_to_folder, tag)
        if(!!tags){
            for (let tag of tags){
                let commit = await GitHelper.getCommitHashForTag(path_to_folder, tag);
                if(commit === commitHash){             // 3. check if commitHash is in commits for tag
                    return tag;
                }
            }
        }
        return null;

    }

    static async getCommitDate(path_to_folder: string, identifier: string): Promise<string | null> {
        try {
            const git: SimpleGit = simpleGit(path_to_folder);
            const options = ['-s', '--format=%ct', identifier];
            const result = await git.show(options);
            const lines = result.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            const timestamp = parseInt(lastLine, 10);
            return isNaN(timestamp) ? null : ""+timestamp;
        } catch (error) {
            console.error('An error occurred:', error);
            return null;
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
        //console.log("getAllTagsFromGitProject");
        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.tags(async (err: Error | null, tags: TagResult) => {
                if (err) {
                    resolve(null);
                } else {
                    const commitTags: string[] = [];
                    for (const tag of tags.all) {
                        //console.log("tag")
                        //console.log(tag)
                        commitTags.push(tag);
                    }
                    //console.log("commitHashes")
                    //console.log(commitTags);
                    resolve(commitTags);
                }
            });
        });
    }

}
