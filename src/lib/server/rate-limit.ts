export type RateCache = {
	match(request: Request): Promise<Response | undefined>;
	put(request: Request, response: Response): Promise<void>;
};

const memory = new Map<string, { count: number; resetAt: number }>();

export async function isRateLimited(
	cache: RateCache | undefined,
	key: string,
	max: number,
	windowSeconds: number
) {
	if (!cache) {
		const now = Date.now();
		const current = memory.get(key);

		if (!current || current.resetAt <= now) {
			memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
			return false;
		}

		current.count += 1;
		return current.count > max;
	}

	const request = new Request(`https://rr-website.rate-limit/${encodeURIComponent(key)}`);
	const cached = await cache.match(request);
	const count = (cached ? Number(await cached.text()) || 0 : 0) + 1;

	if (count > max) {
		return true;
	}

	await cache.put(
		request,
		new Response(String(count), {
			headers: {
				'Cache-Control': `max-age=${windowSeconds}`
			}
		})
	);

	return false;
}
