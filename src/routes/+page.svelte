<script lang="ts">
	import logo from '$lib/assets/rr-logo-transparent.png';
	import logoWhite from '$lib/assets/rr-logo-white.png';
	import banner from '$lib/assets/rhythm-roots-banner-2.png';

	const details = [
		{
			label: 'When?',
			body: 'Classes begin the third or fourth week of September.',
			accent: 'blush'
		},
		{
			label: 'How big?',
			body: 'Just 2–4 students per class — small enough to grow.',
			accent: 'sage'
		},
		{
			label: 'How long?',
			body: 'Each class is 30–45 minutes.',
			accent: 'blush'
		},
		{
			label: 'How many?',
			body: 'Two 12-week blocks of classes.',
			accent: 'sage'
		},
		{
			label: 'What time?',
			body: "During school hours, scheduled around each student's timetable.",
			accent: 'blush'
		},
		{
			label: 'How much?',
			body: '$440 per student per block.',
			accent: 'forest'
		}
	] as const;

	const policies = [
		{
			title: 'Practice',
			accent: 'bg-terracotta',
			body: 'Students must have a guitar for at-home practice, and are expected to practice a minimum of 5 days per week. Regular practice helps students thrive musically — and earn rewards from our prize box.'
		},
		{
			title: 'Missed classes',
			accent: 'bg-sage',
			body: 'If your child is unable to make a scheduled class, please email, call, or text ahead of time. There are no refunds for missed lessons.'
		},
		{
			title: 'How to join',
			accent: 'bg-ochre',
			body: 'Complete the registration form below, then e-transfer the registration fee to reserve your place. The fee covers books and materials.'
		}
	] as const;
</script>

<div class="min-h-dvh overflow-x-hidden">
	<header class="absolute inset-x-0 top-0 z-20">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
			<a href="#top" class="inline-flex items-center logo" aria-label="Rhythm Roots home">
				<img src={logo} alt="Rhythm Roots" class="h-16 w-auto sm:h-20 lg:h-32" />
			</a>
			<a
				href="#join"
				class="rounded-full bg-paper/95 px-4 py-2 text-sm font-semibold tracking-wide text-forest shadow-sm transition hover:bg-white"
			>
				Reserve a spot
			</a>
		</div>
	</header>

	<main id="top">
		<!-- Hero -->
		<section
			class="relative isolate flex h-[600px] items-end overflow-hidden bg-forest text-paper"
			aria-label="Rhythm Roots introduction"
		>
			<img
				src={banner}
				alt=""
				aria-hidden="true"
				class="animate-hero-ken absolute inset-0 h-full w-full object-cover object-[center_center] sm:object-[60%_center]"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-r from-forest/55 via-forest/20 to-transparent"
			></div>
			<div
				class="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-black/15"
			></div>

			<div class="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pb-12">
				<p
					class="animate-fade-up mb-5 font-sans text-xs font-semibold tracking-[0.22em] text-blush uppercase"
				>
					2026–2027 · Grades 4–6
				</p>
				<h1
					class="animate-fade-up-delay-1 max-w-7xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
				>
					Plant the roots.
					<em class="mt-1 block font-medium text-blush italic sm:mt-2"
						>Find the rhythm.</em
					>
				</h1>
				<p
					class="animate-fade-up-delay-2 mt-6 max-w-lg text-base leading-relaxed text-paper/90 sm:text-lg"
				>
					A customized beginner guitar curriculum for grades 4–6 — small groups, school-day
					lessons, and music that actually sticks.
				</p>
				<div class="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center gap-4">
					<a
						href="#join"
						class="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-semibold tracking-wide text-paper transition hover:bg-terracotta-deep"
					>
						Reserve a spot
					</a>
					<a
						href="#details"
						class="inline-flex items-center justify-center rounded-full border border-paper/45 px-6 py-3 text-sm font-semibold tracking-wide text-paper transition hover:border-paper hover:bg-paper/10"
					>
						Course details
					</a>
				</div>
			</div>
		</section>

		<!-- Course details -->
		<section id="details" class="relative overflow-hidden bg-paper py-20 sm:py-28">
			<div
				class="animate-drift pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-sage-mist/35 blur-2xl"
				aria-hidden="true"
			></div>
			<div
				class="animate-drift pointer-events-none absolute top-40 -right-20 h-80 w-80 rounded-full bg-blush/30 blur-2xl"
				aria-hidden="true"
				style="animation-delay: -6s"
			></div>

			<div class="relative mx-auto max-w-7xl px-5 sm:px-8">
				<div class="max-w-2xl">
					<p class="text-xs font-semibold tracking-[0.2em] text-sage uppercase">Course details</p>
					<h2
						class="mt-3 font-display text-3xl font-semibold tracking-tight text-forest text-balance sm:text-4xl"
					>
						Built for beginners who are ready to grow.
					</h2>
					<p class="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
						Rhythm Roots is designed for the 2026–2027 school year — small group classes, clear
						structure, and steady progress from the first chord to confident playing.
					</p>
				</div>

				<ul class="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
					{#each details as item}
						<li class="border-t border-forest/10 pt-5">
							<p
								class="text-xs font-semibold tracking-[0.18em] uppercase
								{item.accent === 'blush'
									? 'text-terracotta'
									: item.accent === 'sage'
										? 'text-sage'
										: 'text-forest'}"
							>
								{item.label}
							</p>
							<p class="mt-3 text-base leading-relaxed text-ink/80 sm:text-[1.05rem]">
								{item.body}
							</p>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- Policies -->
		<section class="bg-sand py-20 sm:py-28" aria-labelledby="policies-heading">
			<div class="mx-auto max-w-7xl px-5 sm:px-8">
				<div class="max-w-2xl">
					<p class="text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">
						What to expect
					</p>
					<h2
						id="policies-heading"
						class="mt-3 font-display text-3xl font-semibold tracking-tight text-forest text-balance sm:text-4xl"
					>
						Roots grow with rhythm and routine.
					</h2>
				</div>

				<div class="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10">
					{#each policies as policy}
						<article>
							<div class="mb-4 h-1 w-10 {policy.accent}" aria-hidden="true"></div>
							<h3 class="font-display text-xl font-semibold text-forest">{policy.title}</h3>
							<p class="mt-3 text-base leading-relaxed text-ink/75">{policy.body}</p>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<!-- Join / CTA -->
		<section id="join" class="bg-forest py-20 text-paper sm:py-28">
			<div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
				<div>
					<p class="text-xs font-semibold tracking-[0.2em] text-blush uppercase">Reserve a spot</p>
					<h2
						class="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
					>
						Ready to plant the roots?
					</h2>
					<p class="mt-5 max-w-lg text-base leading-relaxed text-paper/80 sm:text-lg">
						Share a few details and we’ll follow up with registration next steps. After you hear
						back, e-transfer the registration fee to hold your place.
					</p>

					<form
						class="mt-10 max-w-lg space-y-4"
						action="mailto:hello@rhythmroots.studio"
						method="get"
						enctype="text/plain"
					>
						<label class="block">
							<span class="mb-1.5 block text-sm font-medium text-paper/80">Parent / guardian name</span>
							<input
								type="text"
								name="name"
								required
								autocomplete="name"
								class="w-full rounded-xl border-0 bg-paper/10 px-4 py-3 text-paper placeholder:text-paper/40 ring-1 ring-paper/20 focus:bg-paper/15 focus:ring-2 focus:ring-blush"
								placeholder="Your name"
							/>
						</label>
						<label class="block">
							<span class="mb-1.5 block text-sm font-medium text-paper/80">Email</span>
							<input
								type="email"
								name="email"
								required
								autocomplete="email"
								class="w-full rounded-xl border-0 bg-paper/10 px-4 py-3 text-paper placeholder:text-paper/40 ring-1 ring-paper/20 focus:bg-paper/15 focus:ring-2 focus:ring-blush"
								placeholder="you@email.com"
							/>
						</label>
						<label class="block">
							<span class="mb-1.5 block text-sm font-medium text-paper/80">Student name & grade</span>
							<input
								type="text"
								name="student"
								required
								class="w-full rounded-xl border-0 bg-paper/10 px-4 py-3 text-paper placeholder:text-paper/40 ring-1 ring-paper/20 focus:bg-paper/15 focus:ring-2 focus:ring-blush"
								placeholder="e.g. Avery, Grade 5"
							/>
						</label>
						<label class="block">
							<span class="mb-1.5 block text-sm font-medium text-paper/80">Message (optional)</span>
							<textarea
								name="message"
								rows="3"
								class="w-full rounded-xl border-0 bg-paper/10 px-4 py-3 text-paper placeholder:text-paper/40 ring-1 ring-paper/20 focus:bg-paper/15 focus:ring-2 focus:ring-blush"
								placeholder="School, preferred days, or questions"
							></textarea>
						</label>
						<button
							type="submit"
							class="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold tracking-wide text-paper transition hover:bg-terracotta-deep sm:w-auto"
						>
							Send registration interest
						</button>
					</form>
				</div>

				<aside class="flex flex-col justify-between gap-8 lg:pt-10">
					<div class="rounded-3xl bg-terracotta px-7 py-8 sm:px-8 sm:py-10">
						<p class="text-lg font-semibold tracking-[0.2em] text-paper/80 uppercase">
							Payment details
						</p>
						<ol class="mt-6 space-y-5">
							<li class="flex gap-4">
								<span
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper/15 font-display text-sm font-semibold"
									>>></span
								>
								<p class="pt-1 text-base leading-relaxed">
									<strong class="font-semibold">E-transfer</strong> before the first class
								</p>
							</li>
						</ol>
					</div>

					<div class="rounded-3xl bg-forest-soft px-7 py-8 ring-1 ring-paper/10 sm:px-8">
						<p class="font-display text-2xl font-semibold tracking-tight">rhythmroots.studio</p>
						<p class="mt-3 text-sm leading-relaxed text-paper/70">
							Teaching students one step at a time.
						</p>
					</div>
				</aside>
			</div>
		</section>
	</main>

	<footer class="border-t border-paper/10 bg-sage px-5 py-8 text-paper/60 sm:px-8">
		<div
			class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
		>
			<img src={logoWhite} alt="Rhythm Roots" class="h-8 w-auto opacity-90" />
			<p class="text-sm">© {new Date().getFullYear()} Rhythm Roots. Beginner guitar lessons, grades 4–6.</p>
		</div>
	</footer>
</div>
