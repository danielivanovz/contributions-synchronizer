import {execFileSync} from 'child_process'
import {config} from './config'
import fs from 'fs'

const {paths, author, separator} = config

const isGitRepo = (dir: string, folder: string) =>
  fs.statSync(dir.concat(folder)).isDirectory() && fs.existsSync(dir.concat(folder).concat('/.git'))

export const getGitRepos = (dir: string) => fs.readdirSync(dir).filter(d => isGitRepo(dir, d))

// export const getGitReposMultiDir = () => config.paths.reduce((acc, path) => {
// 		return acc.concat(getGitRepos(path))
// 	}, [] as string[])

export const extract = (dirs: string[]) =>
  dirs.reduce((acc, dir) => {
    const commits = execFileSync(
      'git',
      ['log', '-10', `--pretty=${separator}%cd`, `--author=${author}`],
      {
        cwd: paths.concat(dir)
      }
    )
    return acc.concat(commits.toString())
  }, '')

export const sanitize = (commits: string) =>
  commits
    .split(separator)
    .filter(e => e.length > 0)
    .map(commit => commit.replace(/\n/g, ''))

export const getLastSync = () => {
  const buffer = execFileSync('git', ['log', '-1', `--pretty=${config.separator}%cd`], {
    encoding: 'utf8'
  }).split(config.separator)

  return new Date(buffer[buffer.length - 1])
}

export const isAfterLastSync = (date: string): boolean =>
  new Date(date) >= new Date('2022-07-05T18:37:25.000Z')

export const createCommitAt = (date: string): void =>
  console.info(`git commit --date="${date}" --author="${config.author}" -m "Sync"`)
