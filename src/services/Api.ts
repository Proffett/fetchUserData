const BASE_URL = "https://api.randomuser.me"

class API {
	readonly baseUrl: string

	readonly defaultHeaders: HeadersInit

	constructor(options: { baseUrl: string }) {
		this.baseUrl = options.baseUrl
		this.defaultHeaders = {
			"Content-Type": "application/json; charset=utf-8",
		}
	}

	private getHeaders(): HeadersInit {
		return {
			...this.defaultHeaders,
		}
	}

	public async get(url: string) {
		return fetch(`${this.baseUrl}/${url}`, {
			headers: this.getHeaders(),
			method: "GET",
		})
	}
}

const Api = new API({
	baseUrl: BASE_URL,
})

export default Api
