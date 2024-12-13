<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

{#if browser}
	<ModeWatcher />
{/if}
{@render children()}
