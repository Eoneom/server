export class Module<Queries, Commands> {
  queries: Queries
  commands: Commands

  constructor({
    queries,
    commands
  }: {
    queries: Queries,
    commands: Commands
  }
  ) {
    this.queries = queries
    this.commands = commands
  }
}
