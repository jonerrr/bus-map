<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
</script>

{#if browser}
	<ModeWatcher />
{/if}
<slot />
