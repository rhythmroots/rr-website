// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				SMTP_HOST?: string;
				SMTP_PORT?: string;
				SMTP_USER?: string;
				SMTP_PASSWORD?: string;
				CONTACT_EMAIL?: string;
			};
		}
	}
}

export {};
