import { fail } from '@sveltejs/kit';
import { sendRegistrationEmail } from '$lib/server/email';
import type { Actions } from './$types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asText(value: FormDataEntryValue | null, maxLength: number) {
	return String(value ?? '')
		.trim()
		.slice(0, maxLength);
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		if (asText(data.get('company'), 200)) {
			return { success: true };
		}

		const name = asText(data.get('name'), 200);
		const email = asText(data.get('email'), 320);
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

		try {
			await sendRegistrationEmail({ name, email, student, blocks, message });
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
