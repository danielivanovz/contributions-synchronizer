import {config} from './config'
import {syncProcedure} from './procedure'
import {
  createCommitAt,
  extract,
  getGitRepos,
  getLastSync,
  isAfterLastSync,
  sanitize
} from './helpers'

const update = getLastSync().toISOString()

// I know, is awful
config.lastSync = update
;(async () => {
  await syncProcedure<Array<string>>({
    prepare: () => getGitRepos(config.paths),
    extractor: extract,
    sanitizer: sanitize,
    filter: isAfterLastSync,
    action: [createCommitAt]
  })
})()
