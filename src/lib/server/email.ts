import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export type RegistrationEmail = {
	name: string;
	email: string;
	student: string;
	blocks: string[];
	message: string;
};

function smtpConfig() {
	const port = Number(env.SMTP_PORT || 465);
	return {
		host: env.SMTP_HOST || 'smtp.hostinger.com',
		port,
		secure: port === 465,
		user: env.SMTP_USER || 'contact@rhythmroots.studio',
		password: env.SMTP_PASSWORD ?? '',
		to: env.CONTACT_EMAIL || 'contact@rhythmroots.studio'
	};
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function buildBodies(registration: RegistrationEmail) {
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

export async function sendRegistrationEmail(registration: RegistrationEmail) {
	const config = smtpConfig();

	if (!config.password) {
		throw new Error('SMTP_PASSWORD is not configured');
	}

	const { text, html } = buildBodies(registration);
	const subject = `Registration interest: ${registration.student}`;

	if (dev) {
		const { default: nodemailer } = await import('nodemailer');
		const transporter = nodemailer.createTransport({
			host: config.host,
			port: config.port,
			secure: config.secure,
			auth: {
				user: config.user,
				pass: config.password
			}
		});

		await transporter.sendMail({
			from: { name: 'Rhythm Roots', address: config.user },
			to: config.to,
			replyTo: { name: registration.name, address: registration.email },
			subject,
			text,
			html
		});
		return;
	}

	const { WorkerMailer } = await import('worker-mailer');
	await WorkerMailer.send(
		{
			host: config.host,
			port: config.port,
			secure: config.secure,
			startTls: !config.secure,
			authType: ['login', 'plain'],
			credentials: {
				username: config.user,
				password: config.password
			}
		},
		{
			from: { name: 'Rhythm Roots', email: config.user },
			to: config.to,
			reply: { name: registration.name, email: registration.email },
			subject,
			text,
			html
		}
	);
}
