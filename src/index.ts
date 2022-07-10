import {config} from './config'
import {syncProcedure} from './procedure'
import {
  createFileAt,
  extract,
  getGitRepos,
  getLastSync,
  isAfterLastSync,
  sanitize,
  stageFileAt,
  createCommitAt
} from './helpers'

const update = getLastSync().toISOString()

const actions = async (date: string) => {
  await createFileAt(date)
  await stageFileAt(date)
  createCommitAt(date)
}

// I know, is awful
// config.lastSync = update
;(async () => {
  await syncProcedure<Array<string>>({
    prepare: () => getGitRepos(config.paths),
    extractor: extract,
    sanitizer: sanitize,
    filter: isAfterLastSync,
    action: [console.log]
  })
})()
