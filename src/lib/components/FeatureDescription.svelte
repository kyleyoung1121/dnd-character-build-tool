<script lang="ts">
	import type {
		FeatureDescription,
		DescriptionBlock
	} from '$lib/data/types/Features';

	export let description: FeatureDescription;

	function renderText(block: DescriptionBlock) {
		if (block.type === 'text') {
			return block.text;
		}
		return '';
	}
</script>

{#each description.blocks as block}
	{#if block.type === 'text'}
		<p>{block.text}</p>
	{:else if block.type === 'computed-inline'}
		<p>
			{block.text}
			<span class="computed-hint">
				{block.hintFormat.replace('{value}', '?')}
			</span>
		</p>
	{:else if block.type === 'computed-replacement'}
		<p>{block.fallbackText}</p>
	{/if}
{/each}
