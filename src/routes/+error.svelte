<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-col justify-center items-center">
	<h1 class="text-red-400 text-4xl">{$page.status}: {$page.error!.message}</h1>
</div>
