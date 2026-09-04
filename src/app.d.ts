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
				HOSTINGER_API_KEY?: string;
				HOSTINGER_MAILBOX_ID?: string;
				CONTACT_EMAIL?: string;
			};
		}
	}
}

export {};
