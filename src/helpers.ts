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
  new Date(date) >= new Date(getLastSync().toISOString())

export const stageFileAt = async (date: string) =>
  execFileSync('git', ['add', './commits/' + date + '.dat'])

export const createFileAt = (date: string) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile('./commits/' + date + '.dat', '', function (err) {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

export const createCommitAt = (date: string) => {
  execFileSync('git', [
    'commit',
    '--date="' + date + '"',
    '--author="' + config.commiter + '"',
    '-m "Sync for ' + date + '"',
    '--allow-empty'
  ])
}
