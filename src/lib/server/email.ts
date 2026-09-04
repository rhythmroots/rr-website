import { env } from '$env/dynamic/private';

export type RegistrationEmail = {
	name: string;
	email: string;
	student: string;
	blocks: string[];
	message: string;
};

const CONTACT_EMAIL = 'contact@rhythmroots.studio';
const MAIL_API = 'https://api.mail.hostinger.com/api/v1';
const DEFAULT_MAILBOX_ID = 'AC65cc315d2015b06ffd1cc2a2e49a';

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function mailConfig(platformEnv?: App.Platform['env']) {
	return {
		token: env.HOSTINGER_API_KEY || platformEnv?.HOSTINGER_API_KEY || '',
		mailboxId: env.HOSTINGER_MAILBOX_ID || platformEnv?.HOSTINGER_MAILBOX_ID || DEFAULT_MAILBOX_ID,
		studio: env.CONTACT_EMAIL || platformEnv?.CONTACT_EMAIL || CONTACT_EMAIL
	};
}

async function sendMail(
	config: ReturnType<typeof mailConfig>,
	payload: {
		to: string;
		subject: string;
		text: string;
		html: string;
	}
) {
	const response = await fetch(`${MAIL_API}/mailboxes/${config.mailboxId}/send`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${config.token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			to: [payload.to],
			displayName: 'Rhythm Roots',
			subject: payload.subject,
			text: payload.text,
			html: payload.html
		})
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Hostinger Mail API ${response.status}: ${details.slice(0, 300)}`);
	}
}

function studioBodies(registration: RegistrationEmail) {
	const blocks = registration.blocks.length ? registration.blocks.join(', ') : 'Not specified';
	const message = registration.message || '(none)';

	const text = [
		'New Rhythm Roots registration interest',
		'',
		`Parent / guardian: ${registration.name}`,
		`Email: ${registration.email}`,
		`Student: ${registration.student}`,
		`Blocks: ${blocks}`,
		`Message: ${message}`
	].join('\n');

	const html = `
		<div style="font-family: Outfit, ui-sans-serif, system-ui, sans-serif; color: #122424; line-height: 1.5;">
			<p style="margin: 0 0 16px; font-size: 16px;">New Rhythm Roots registration interest</p>
			<table style="border-collapse: collapse; width: 100%; max-width: 560px;">
				<tr>
					<td style="padding: 8px 0; color: #5b7869; width: 160px;">Parent / guardian</td>
					<td style="padding: 8px 0;">${escapeHtml(registration.name)}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; color: #5b7869;">Email</td>
					<td style="padding: 8px 0;">${escapeHtml(registration.email)}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; color: #5b7869;">Student</td>
					<td style="padding: 8px 0;">${escapeHtml(registration.student)}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; color: #5b7869;">Blocks</td>
					<td style="padding: 8px 0;">${escapeHtml(blocks)}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; color: #5b7869; vertical-align: top;">Message</td>
					<td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(message)}</td>
				</tr>
			</table>
		</div>
	`.trim();

	return { text, html };
}

function confirmationBodies(registration: RegistrationEmail) {
	const firstName = registration.name.split(/\s+/)[0] || 'there';
	const blocks = registration.blocks.length
		? registration.blocks.join(' and ')
		: 'the upcoming class blocks';

	const text = [
		`Hi ${firstName},`,
		'',
		'Thank you for your interest in Rhythm Roots. We received your registration details and will be in touch with you soon.',
		'',
		`Student: ${registration.student}`,
		`Blocks: ${blocks}`,
		'',
		'If you have questions in the meantime, reply to this email.',
		'',
		'Rhythm Roots',
		'rhythmroots.studio'
	].join('\n');

	const html = `
		<div style="font-family: Outfit, ui-sans-serif, system-ui, sans-serif; color: #122424; line-height: 1.6;">
			<p style="margin: 0 0 16px;">Hi ${escapeHtml(firstName)},</p>
			<p style="margin: 0 0 16px;">
				Thank you for your interest in Rhythm Roots. We received your registration details and will be in touch with you soon.
			</p>
			<p style="margin: 0 0 16px;">
				<strong>Student:</strong> ${escapeHtml(registration.student)}<br />
				<strong>Blocks:</strong> ${escapeHtml(blocks)}
			</p>
			<p style="margin: 0 0 16px;">If you have questions in the meantime, reply to this email.</p>
			<p style="margin: 0;">
				Rhythm Roots<br />
				<span style="color: #5b7869;">rhythmroots.studio</span>
			</p>
		</div>
	`.trim();

	return { text, html };
}

export async function sendRegistrationEmail(
	registration: RegistrationEmail,
	platformEnv?: App.Platform['env']
) {
	const config = mailConfig(platformEnv);

	if (!config.token) {
		throw new Error('HOSTINGER_API_KEY is not configured');
	}

	const studio = studioBodies(registration);
	await sendMail(config, {
		to: config.studio,
		subject: `Registration interest: ${registration.student}`,
		...studio
	});

	try {
		const confirmation = confirmationBodies(registration);
		await sendMail(config, {
			to: registration.email,
			subject: 'We received your Rhythm Roots registration interest',
			...confirmation
		});
	} catch (error) {
		console.error('Confirmation email failed', error);
	}
}
