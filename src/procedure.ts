type DataToImport = Array<string>

export interface ISyncProcedureArguments<A extends DataToImport> {
  prepare: () => A
  extractor: (A: string[]) => string
  sanitizer: (a: string) => A
  action: Array<(a: any) => void>
  filter: (a: string) => boolean
}

export const syncProcedure = async <A extends DataToImport>(
  props: ISyncProcedureArguments<A>
): Promise<void> => {
  const {prepare, extractor, sanitizer, filter: isNew, action} = props

  const commits: Array<string> = sanitizer(extractor(prepare())).map(d => new Date(d).toISOString())

  await Promise.all(
    commits.filter(isNew).map(async task => {
      if (task === null || task === undefined) return

      try {
        await action.reduce((acc, fn) => {
          return acc
            .then(() => fn(task))
            .catch(e => {
              throw e
            })
        }, Promise.resolve())
      } catch (error) {
        console.error(`error with ${task} -> `, error)
      }
    })
  )
}
