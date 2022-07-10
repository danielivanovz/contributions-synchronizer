interface IConfigurations {
  paths: string
  author: string
  separator: string
  commiter: string
}

export const config: IConfigurations = {
  paths: '/random/directory/name/',
  author: 'your@email.com',
  separator: '@_separator_@',
  commiter: 'Name Surname <this.repo@mail.com>'
}
