interface IConfigurations {
  paths: string
  author: string
  separator: string
  lastSync: string
}

export const config: IConfigurations = {
  paths: '/random/directory/name/',
  author: 'your@email.com',
  separator: '@_separator_@',
  lastSync: 'xx-xx-xxTxx:xx:xx.000Z'
}
