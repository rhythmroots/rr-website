<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import faviconPng from '$lib/assets/favicon-32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="icon" href={faviconPng} type="image/png" sizes="32x32" />
	<link rel="apple-touch-icon" href={appleTouchIcon} />
	<meta
		name="description"
		content="Rhythm Roots — beginner guitar for grades 4–6. Small groups, school-day lessons, and music that sticks. 2026–2027 school year."
	/>
	<meta property="og:title" content="Rhythm Roots" />
	<meta
		property="og:description"
		content="Plant the roots. Find the rhythm. Beginner guitar for grades 4–6."
	/>
	<meta name="theme-color" content="#0d2b2a" />
	<title>Rhythm Roots</title>
</svelte:head>

{@render children()}
