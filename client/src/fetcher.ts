export class Fetcher {
  private base_url: string

  constructor({ base_url }: { base_url: string}) {
    this.base_url = base_url
  }

  public async post<T>(path: string, body: unknown): Promise<T> {
    return this.request('POST', path, body)
  }

  public async put<T>(path: string, body: unknown): Promise<T> {
    return this.request('PUT', path, body)
  }

  private async request<T>(method: string, path:string, body?: unknown): Promise<T> {
    const url = this.getUrl(path)
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(data => data.json())
  }

  private getUrl(path: string) {
    return `${this.base_url}${path}`
  }
}
