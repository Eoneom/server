export class Fetcher {
  private base_url: string

  constructor({ base_url }: { base_url: string}) {
    this.base_url = base_url
  }

  public async get<T>(path: string, { token }: { token: string }): Promise<T> {
    return this.request({
      method: 'GET',
      path,
      token
    })
  }

  public async post<T>(path: string, {
    body,
    token
  }: {
    body?: unknown
    token?: string
  }): Promise<T> {
    return this.request({
      method: 'POST',
      path,
      body,
      token
    })
  }

  public async put<T>(path: string, {
    body,
    token
  }: {
    body?: unknown
    token?: string
  }): Promise<T> {
    return this.request({
      method: 'PUT',
      path,
      body,
      token
    })
  }

  private async request<T>({
    method,
    path,
    body,
    token
  }: {
    method: string,
    path: string,
    body?: unknown
    token?: string
  }): Promise<T> {
    const url = this.getUrl(path)
    const headers = new Headers({ 'Content-Type': 'application/json' })
    if (token) {
      headers.append('Authorization', token)
    }
    return fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    }).then(data => data.json())
  }

  private getUrl(path: string) {
    return `${this.base_url}${path}`
  }
}
