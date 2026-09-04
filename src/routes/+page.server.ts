import { fail } from '@sveltejs/kit';
import { sendRegistrationEmail } from '$lib/server/email';
import { isRateLimited } from '$lib/server/rate-limit';
import type { Actions } from './$types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 800;

function asText(value: FormDataEntryValue | null, maxLength: number) {
	return String(value ?? '')
		.trim()
		.slice(0, maxLength);
}

export const actions = {
	default: async ({ request, platform, getClientAddress }) => {
		const data = await request.formData();

		if (asText(data.get('company'), 200)) {
			return { success: true };
		}

		const started = Number(data.get('started'));
		if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
			return { success: true };
		}

		const name = asText(data.get('name'), 200);
		const email = asText(data.get('email'), 320).toLowerCase();
		const student = asText(data.get('student'), 200);
		const message = asText(data.get('message'), 2000);
		const blocks = data
			.getAll('blocks')
			.map((value) => String(value))
			.filter((value) => value === 'Block 1' || value === 'Block 2');

		if (!name || !email || !student) {
			return fail(400, { error: 'Please fill in all required fields.' });
		}

		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Please enter a valid email address.' });
		}

		const cache = platform?.caches?.default as
			| import('$lib/server/rate-limit').RateCache
			| undefined;
		const ip = getClientAddress();
		const limited =
			(await isRateLimited(cache, `ip:${ip}`, 3, 15 * 60)) ||
			(await isRateLimited(cache, `email:${email}`, 3, 60 * 60));

		if (limited) {
			return fail(429, {
				error: 'Please wait a few minutes before submitting again.'
			});
		}

		try {
			await sendRegistrationEmail({ name, email, student, blocks, message }, platform?.env);
		} catch (error) {
			console.error('Registration email failed', error);
			return fail(500, {
				error:
					'Something went wrong sending your registration. Please try again or email contact@rhythmroots.studio.'
			});
		}

		return { success: true };
	}
} satisfies Actions;
