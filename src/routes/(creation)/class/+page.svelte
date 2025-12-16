<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import FeatureCardList from '$lib/components/FeatureCardList.svelte';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { isFeatureIncomplete } from '$lib/components/feature-card-utils';
	import FeatureDescription from '$lib/components/FeatureDescription.svelte';
	
	import { barbarian } from '$lib/data/classes/barbarian';
	import { bard } from '$lib/data/classes/bard';
	import { cleric } from '$lib/data/classes/cleric';
	import { druid } from '$lib/data/classes/druid';
	import { fighter } from '$lib/data/classes/fighter';
	import { monk } from '$lib/data/classes/monk';
	import { paladin } from '$lib/data/classes/paladin';
	import { ranger } from '$lib/data/classes/ranger';
	import { rogue } from '$lib/data/classes/rogue';
	import { sorcerer } from '$lib/data/classes/sorcerer';
	import { warlock } from '$lib/data/classes/warlock';
	import { wizard } from '$lib/data/classes/wizard';
	import type { ClassData } from '$lib/data/types/ClassData';
	import type { FeaturePrompt } from '$lib/data/types/Features';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	const classes: ClassData[] = [
		barbarian,
		bard,
		cleric,
		druid,
		fighter,
		monk,
		paladin,
		ranger,
		rogue,
		sorcerer,
		warlock,
		wizard
	];

	let selectedClass: ClassData | null = null;
	let selectedClassData: ClassData | null = null;

	// featureSelections maps feature.name -> array of picks (by index)
	let featureSelections: Record<string, (string | null)[]> = {};

	let expandedFeatures = new Set<string>();

	// Used to force Svelte to re-create <select> nodes so option lists refresh instantly
	let selectionVersion = 0;

	function bumpVersion() {
		selectionVersion = (selectionVersion + 1) % 1_000_000;
	}

	// Current feature list for the selected class
	$: mergedFeatures = selectedClassData ? [...(selectedClassData.classFeatures || [])] : [];

	// make sure this lives in <script> and stays after isFeatureIncomplete is defined
	$: featureStatuses = mergedFeatures.map((feature) => ({
		feature,
		incomplete: isFeatureIncomplete(feature, featureSelections)
	}));

	function removeSelectedClass() {
		if (selectedClassData) {
			if (typeof window !== 'undefined') {
				(window as any).classRemovalDebug = {
					attemptedClass: selectedClassData.name,
					steps: ['Starting removal process'],
					timestamp: new Date().toISOString(),
					hasExpertiseFeature: selectedClassData.classFeatures?.some(
						(f) =>
							f.name.toLowerCase().includes('expertise') ||
							f.featureOptions?.dynamicOptionsGenerator?.type === 'proficient-skills-plus-tools'
					),
					expertiseFeatures: selectedClassData.classFeatures
						?.filter(
							(f) =>
								f.name.toLowerCase().includes('expertise') ||
								f.featureOptions?.dynamicOptionsGenerator?.type === 'proficient-skills-plus-tools'
						)
						.map((f) => f.name)
				};
			}

			const state = get(character_store);
			const provKeys = Object.keys(state._provenance || {});

			if (typeof window !== 'undefined' && (window as any).classRemovalDebug) {
				(window as any).classRemovalDebug.steps.push(`Found ${provKeys.length} provenance keys`);
				(window as any).classRemovalDebug.provKeys = provKeys;
			}

			function collectFeatureNames(features: FeaturePrompt[]): string[] {
				try {
					const names: string[] = [];
					for (const feat of features) {
						names.push(feat.name);
						if (feat.featureOptions) {
							if (feat.featureOptions.dynamicOptionsGenerator) {
								continue;
							}
							const options = feat.featureOptions.options;
							if (Array.isArray(options)) {
								for (const opt of options) {
									if (typeof opt !== 'string' && opt.nestedPrompts) {
										names.push(...collectFeatureNames(opt.nestedPrompts));
									}
								}
							}
						}
					}
					return names;
				} catch (error) {
					console.error('Error in collectFeatureNames:', error);
					throw error;
				}
			}

			let allFeatureNames: string[] = [];
			let prefixes: string[] = [];

			try {
				allFeatureNames = collectFeatureNames(selectedClassData.classFeatures || []);
				prefixes = [
					`class:${selectedClassData.name}`,
					...allFeatureNames.map((f) => `feature:${f}`),
					'class_equipment_'
				];
			} catch (error) {
				console.error('Error during feature collection:', error);
				return;
			}

			const revertedKeys: string[] = [];
			const revertErrors: Array<{ key: string; error: any }> = [];

			for (const key of provKeys) {
				if (prefixes.some((prefix) => key.startsWith(prefix))) {
					try {
						revertChanges(get(character_store), key);
						revertedKeys.push(key);
					} catch (error) {
						revertErrors.push({ key, error });
						console.error('Error reverting key:', key, error);
					}
				}
			}
		}

		selectedClassData = null;
		selectedClass = null;
		featureSelections = {};
		expandedFeatures = new Set();
		bumpVersion();
	}

	function confirmAddClass() {
		if (selectedClass) {
			selectedClassData = selectedClass;
			selectedClass = null;
			featureSelections = {};
			expandedFeatures = new Set();

			applyChoice(`class:${selectedClassData.name}`, {
				class: selectedClassData.name
			});

			for (const feature of selectedClassData.classFeatures || []) {
				// Skip features with options; those will be applied later
				if (feature.featureOptions) continue;

				const scopeId = `feature:${feature.name}`;
				revertChanges(get(character_store), scopeId); // just in case

				const update: Record<string, any> = {};
				const modify: Record<string, number> = {};

				for (const effect of feature.effects || []) {
					const target = effect.target;
					const value = effect.value;

					switch (effect.action) {
						case 'add': {
							const arr = Array.isArray(value) ? value : [value];
							if (!update[target]) update[target] = [];
							update[target].push(...arr);
							break;
						}
						case 'set': {
							update[target] = value;
							break;
						}
						case 'modify': {
							const amount = Number(value);
							if (!isNaN(amount)) {
								modify[target] = (modify[target] ?? 0) + amount;
							}
							break;
						}
					}
				}

				applyChoice(scopeId, update, modify);
			}

			bumpVersion();
		}
	}

	function calculateMaxHP(hitDie: string | undefined) {
		if (!hitDie) return 'N/A';
		const match = hitDie.match(/d(\d+)/);
		if (!match) return 'N/A';
		const dieMax = parseInt(match[1], 10);
		const averagePerDie = Math.floor(dieMax / 2) + 1;
		return dieMax + averagePerDie * 2;
	}

	// Helper function needed by onMount
	function ensureArrayLen(arr: (string | null)[], len: number) {
		if (!arr) return;
		if (arr.length < len) {
			const oldLen = arr.length;
			arr.length = len;
			for (let i = oldLen; i < len; i++) arr[i] = null;
		}
	}

	// --- onMount for class feature restoration ---
	onMount(async () => {
		const DBG = '[NESTED RESTORE DEBUG]';
		const state = get(character_store);
		if (!state.class) {
			console.log(`${DBG} No class selected, skipping restoration`);
			return;
		}
	
		console.log(`${DBG} Starting class restoration for:`, state.class);
	
		// Find selected class
		const found = classes.find((c) => c.name === state.class);
		if (!found) {
			console.log(`${DBG} Class not found in data:`, state.class);
			return;
		}
	
		console.log(`${DBG} Found class data:`, found.name, 'with', found.classFeatures?.length || 0, 'features');
	
		selectedClassData = found;
		featureSelections = {};
	
		// small helper to show a short sample of provenance keys for debugging
		const provSample = () => {
			const provKeys = Object.keys(state._provenance || {});
			return provKeys.slice(0, 40); // first 40 keys to avoid flooding the console
		};
	
		const toSnakeCase = (str: string) =>
			str
				? str
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '_')
						.replace(/^_+|_+$/g, '')
				: '';
	
		// Helper: convert stored snake_case value to display label
		const tryRestoreFromValue = (val: string, optionMap: Map<string, string>) => {
			if (!val) return null;
			const snakeVal = toSnakeCase(val);
			// exact first
			for (const [key, label] of optionMap.entries()) {
				if (snakeVal === key) return label;
			}
			// then includes
			for (const [key, label] of optionMap.entries()) {
				if (snakeVal.includes(key) || key.includes(snakeVal)) return label;
			}
			// label equality fallback
			for (const [key, label] of optionMap.entries()) {
				if (toSnakeCase(label) === snakeVal) return label;
			}
			return null;
		};
	
		// Unified helper to attempt to fetch provenance under multiple plausible key shapes
		const getProvenanceEntry = (featureName: string, idx?: number, parentFeatureName?: string) => {
			const prov = state._provenance || {};
			const namesToTry: string[] = [];
	
			// canonical per-requested scheme: feature:Class:Parent:Feature
			if (selectedClassData) {
				if (parentFeatureName) {
					namesToTry.push(`feature:${selectedClassData.name}:${parentFeatureName}:${featureName}`);
				}
				// canonical top-level with class
				namesToTry.push(`feature:${selectedClassData.name}:${featureName}`);
			}
	
			// legacy or simpler shapes that we observed in logs
			if (typeof idx === 'number') {
				namesToTry.push(`feature:${featureName}:${idx}`);
			}
			namesToTry.push(`feature:${featureName}`);
	
			// also try class + idx variant just in case
			if (selectedClassData && typeof idx === 'number') {
				namesToTry.push(`feature:${selectedClassData.name}:${featureName}:${idx}`);
			}
	
			// DEBUG: print attempted key shapes for this lookup
			console.log(`${DBG} getProvenanceEntry: feature='${featureName}', idx=${String(idx)}, parent='${String(parentFeatureName)}', trying keys:`, namesToTry);
	
			for (const n of namesToTry) {
				if (prov[n]) {
					console.log(`${DBG} Provenance hit: key='${n}' for feature='${featureName}'`);
					return { key: n, entry: prov[n] };
				}
			}
			console.log(`${DBG} No provenance entry found for feature='${featureName}' (sample prov keys):`, provSample());
			return null;
		};
	
		// Helper: recursively check if any deeper nested features have provenance (matches any key shape)
		const checkDeeperNestedProvenance = (feature: any): boolean => {
			const prov = state._provenance || {};
			if (!feature.featureOptions?.options) return false;
			for (const opt of feature.featureOptions.options) {
				if (typeof opt !== 'string' && opt.nestedPrompts) {
					for (const nested of opt.nestedPrompts) {
						// check for any key that mentions nested.name
						const foundAny = Object.keys(prov).some((k) => k.includes(`feature:${nested.name}`) || k.includes(`:${nested.name}:`));
						if (foundAny) {
							console.log(`${DBG} checkDeeperNestedProvenance: found provenance mentioning nested='${nested.name}'`);
							return true;
						}
						if (checkDeeperNestedProvenance(nested)) return true;
					}
				}
			}
			return false;
		};
	
		// restore nested feature selections (parentFeatureName used for key shaping, parentIndex kept for logical recursion)
		const restoreNestedFeatureSelection = async (feature: FeaturePrompt, parentFeatureName: string, parentIndex: number) => {
			console.log(`${DBG} restoreNestedFeatureSelection start: feature='${feature.name}', parent='${parentFeatureName}', parentIndex=${parentIndex}`);
			const numPicks = feature.featureOptions?.numPicks || 1;
	
			// ensure selection array exists and is correct length
			if (!featureSelections[feature.name]) featureSelections[feature.name] = Array(numPicks).fill(null);
			ensureArrayLen(featureSelections[feature.name], numPicks);
			console.log(`${DBG} selection slot for '${feature.name}' prepared:`, featureSelections[feature.name]);
	
			const optionMap = new Map(
				(feature.featureOptions?.options || []).map((o) => [
					toSnakeCase(typeof o === 'string' ? o : o.name),
					typeof o === 'string' ? o : o.name
				])
			);
			console.log(`${DBG} optionMap for '${feature.name}':`, Array.from(optionMap.entries()));
	
			for (let idx = 0; idx < numPicks; idx++) {
				// skip if already restored
				if (featureSelections[feature.name][idx]) {
					console.log(`${DBG} skip restore for '${feature.name}' idx=${idx} (already set):`, featureSelections[feature.name][idx]);
					continue;
				}
	
				const provLookup = getProvenanceEntry(feature.name, idx, parentFeatureName);
				const stored = provLookup?.entry;
				const provKey = provLookup?.key;
	
				console.log(`${DBG} Nested restore probe: feature='${feature.name}', idx=${idx}, provKey='${provKey}', stored=`, stored);
	
				// try to restore from direct provenance entry
				let restored: string | null = null;
				if (stored?._set) {
					for (const effect of feature.effects || []) {
						const target = effect.target;
						const arr = stored._set?.[target];
						if (Array.isArray(arr)) {
							for (const val of arr) {
								const maybe = tryRestoreFromValue(val, optionMap);
								if (maybe) {
									restored = maybe;
									console.log(`${DBG} Restored from _set array match: feature='${feature.name}', idx=${idx}, value='${val}', mapped='${maybe}'`);
									break;
								}
							}
						} else if (typeof arr === 'string') {
							const maybe = tryRestoreFromValue(arr, optionMap);
							if (maybe) {
								restored = maybe;
								console.log(`${DBG} Restored from _set string match: feature='${feature.name}', idx=${idx}, value='${arr}', mapped='${maybe}'`);
							}
						}
						if (restored) break;
					}
				}
	
				// _mods fallback
				if (!restored && stored?._mods) {
					for (const modKey of Object.keys(stored._mods)) {
						const maybe = tryRestoreFromValue(modKey, optionMap);
						if (maybe) {
							restored = maybe;
							console.log(`${DBG} Restored from _mods key match: feature='${feature.name}', idx=${idx}, modKey='${modKey}', mapped='${maybe}'`);
							break;
						}
					}
				}
	
				// If no direct provenance, try to infer by checking deeper nested provenance for each option
				if (!restored && feature.featureOptions?.options) {
					for (const opt of feature.featureOptions.options) {
						if (typeof opt !== 'string' && opt.nestedPrompts) {
							const hasNestedProv = Object.keys(state._provenance || {}).some((k) =>
								k.includes(`feature:${opt.name}`) || k.includes(`:${opt.name}:`)
							);
							const hasDeeperProv = opt.nestedPrompts.some((n) => checkDeeperNestedProvenance(n));
							if (hasNestedProv || hasDeeperProv) {
								restored = opt.name;
								console.log(`${DBG} Inferred parent selection '${restored}' for '${feature.name}' because nested provenance present`);
								break;
							}
						}
					}
				}
	
				if (restored) {
					featureSelections[feature.name][idx] = restored;
					console.log(`${DBG} Applied restored nested selection: feature='${feature.name}' idx=${idx} => '${restored}'`);
				} else {
					console.log(`${DBG} No restored value for nested feature='${feature.name}' idx=${idx}`);
				}
			}
	
			// Recurse into deeper nested prompts if any (use parent index inferred from selection)
			if (feature.featureOptions?.options) {
				for (const o of feature.featureOptions.options) {
					if (typeof o !== 'string' && o.nestedPrompts) {
						const parentIdx = featureSelections[feature.name].findIndex((v) => v === o.name);
						if (parentIdx !== -1) {
							console.log(`${DBG} Recursing into nested prompts for parent option='${o.name}' parentIdx=${parentIdx}`);
							for (const nested of o.nestedPrompts) {
								await restoreNestedFeatureSelection(nested, feature.name, parentIdx);
							}
						} else {
							// still try to restore nested if nested provenance exists even when parent wasn't set
							for (const nested of o.nestedPrompts) {
								const hasNestedProv = Object.keys(state._provenance || {}).some((k) =>
									k.includes(`feature:${nested.name}`) || k.includes(`:${nested.name}:`)
								);
								if (hasNestedProv) {
									console.log(`${DBG} Found nested provenance for '${nested.name}' even though parent '${o.name}' not set; forcing parent pick`);
									// ensure parent pick exists
									if (!featureSelections[feature.name].includes(o.name)) {
										const emptyIdx = featureSelections[feature.name].findIndex((v) => v === null);
										if (emptyIdx !== -1) {
											featureSelections[feature.name][emptyIdx] = o.name;
											console.log(`${DBG} Forced parent selection '${o.name}' into slot idx=${emptyIdx} for feature='${feature.name}'`);
										}
									}
									const resolvedParentIdx = featureSelections[feature.name].findIndex((v) => v === o.name);
									if (resolvedParentIdx !== -1) {
										await restoreNestedFeatureSelection(nested, feature.name, resolvedParentIdx);
									}
								}
							}
						}
					}
				}
			}
			console.log(`${DBG} restoreNestedFeatureSelection end: feature='${feature.name}'`);
		};
	
		// Restore top-level features and their nested prompts
		const restoreFeatureSelection = async (feature: FeaturePrompt) => {
			console.log(`${DBG} restoreFeatureSelection start: '${feature.name}'`);
			const numPicks = feature.featureOptions?.numPicks || 1;
	
			if (!featureSelections[feature.name]) featureSelections[feature.name] = Array(numPicks).fill(null);
			ensureArrayLen(featureSelections[feature.name], numPicks);
			console.log(`${DBG} prepared selection array for '${feature.name}':`, featureSelections[feature.name]);
	
			// build option map (including dynamic generation when necessary)
			let opts: (string | { name: string })[] = feature.featureOptions?.options || [];
			if (feature.featureOptions?.dynamicOptionsGenerator) {
				try {
					const { generateDynamicOptions } = await import('$lib/components/feature-card-utils');
					const dynamicOpts = generateDynamicOptions(
						feature.featureOptions.dynamicOptionsGenerator,
						character_store,
						featureSelections
					);
					opts = dynamicOpts;
				} catch (error) {
					console.warn(`${DBG} Failed to generate dynamic options for restoration for '${feature.name}':`, error);
				}
			}
	
			const optionMap = new Map(
				(opts as any[]).map((o) => [toSnakeCase(typeof o === 'string' ? o : o.name), typeof o === 'string' ? o : o.name])
			);
			console.log(`${DBG} optionMap for top-level feature '${feature.name}':`, Array.from(optionMap.entries()));
	
			for (let idx = 0; idx < numPicks; idx++) {
				if (featureSelections[feature.name][idx]) {
					console.log(`${DBG} skip top-level restore for '${feature.name}' idx=${idx} (already set):`, featureSelections[feature.name][idx]);
					continue;
				}
	
				// try multiple possible provenance key shapes
				const provLookup = getProvenanceEntry(feature.name, idx);
				const stored = provLookup?.entry;
				const provKey = provLookup?.key;
				console.log(`${DBG} Top-level restore probe: feature='${feature.name}', idx=${idx}, provKey='${provKey}', stored=`, stored);
	
				let restored: string | null = null;
	
				if (stored?._set) {
					for (const effect of feature.effects || []) {
						const target = effect.target;
						const arr = stored._set?.[target];
						if (Array.isArray(arr)) {
							for (const val of arr) {
								const maybe = tryRestoreFromValue(val, optionMap);
								if (maybe) {
									restored = maybe;
									console.log(`${DBG} Restored top-level from _set array: feature='${feature.name}' idx=${idx} => '${maybe}'`);
									break;
								}
							}
						} else if (typeof arr === 'string') {
							const maybe = tryRestoreFromValue(arr, optionMap);
							if (maybe) {
								restored = maybe;
								console.log(`${DBG} Restored top-level from _set string: feature='${feature.name}' idx=${idx} => '${maybe}'`);
							}
						}
						if (restored) break;
					}
				}
	
				if (!restored && stored?._mods) {
					for (const modKey of Object.keys(stored._mods)) {
						const maybe = tryRestoreFromValue(modKey, optionMap);
						if (maybe) {
							restored = maybe;
							console.log(`${DBG} Restored top-level from _mods key: feature='${feature.name}', modKey='${modKey}' => '${maybe}'`);
							break;
						}
					}
				}
	
				// If still not restored, infer from nested provenance (handles empty-effect features)
				if (!restored && feature.featureOptions?.options) {
					for (const opt of feature.featureOptions.options) {
						if (typeof opt !== 'string' && opt.nestedPrompts) {
							const hasNestedProv = Object.keys(state._provenance || {}).some((k) =>
								k.includes(`feature:${opt.name}`) || k.includes(`:${opt.name}:`)
							);
							const hasDeeperProv = opt.nestedPrompts.some((n) => checkDeeperNestedProvenance(n));
							if (hasNestedProv || hasDeeperProv) {
								restored = opt.name;
								console.log(`${DBG} Inferred top-level selection '${restored}' for '${feature.name}' from nested provenance`);
								break;
							}
						}
					}
				}
	
				if (restored) {
					featureSelections[feature.name][idx] = restored;
					console.log(`${DBG} Applied restored top-level selection: feature='${feature.name}' idx=${idx} => '${restored}'`);
				} else {
					console.log(`${DBG} No restored value for top-level feature='${feature.name}' idx=${idx}`);
				}
	
				// Recurse into nested prompts for this pick
				if (feature.featureOptions?.options) {
					for (const o of feature.featureOptions.options) {
						if (typeof o !== 'string' && o.nestedPrompts) {
							const parentIdx = featureSelections[feature.name].findIndex((v) => v === o.name);
							if (parentIdx !== -1) {
								console.log(`${DBG} Recurse nested for parent option='${o.name}' at parentIdx=${parentIdx}`);
								for (const nested of o.nestedPrompts) {
									await restoreNestedFeatureSelection(nested, feature.name, parentIdx);
								}
							} else {
								// else check nested provenance and force parent if necessary
								for (const nested of o.nestedPrompts) {
									const hasNestedProv = Object.keys(state._provenance || {}).some((k) =>
										k.includes(`feature:${nested.name}`) || k.includes(`:${nested.name}:`)
									);
									if (hasNestedProv) {
										console.log(`${DBG} Nested provenance exists for '${nested.name}', forcing parent '${o.name}'`);
										if (!featureSelections[feature.name].includes(o.name)) {
											const emptyIdx = featureSelections[feature.name].findIndex((v) => v === null);
											if (emptyIdx !== -1) {
												featureSelections[feature.name][emptyIdx] = o.name;
												console.log(`${DBG} Forced parent '${o.name}' into slot idx=${emptyIdx}`);
											}
										}
										const resolvedParentIdx = featureSelections[feature.name].findIndex((v) => v === o.name);
										if (resolvedParentIdx !== -1) {
											await restoreNestedFeatureSelection(nested, feature.name, resolvedParentIdx);
										}
									}
								}
							}
						}
					}
				}
			}
	
			console.log(`${DBG} restoreFeatureSelection end: '${feature.name}'`);
		};
	
		// Restore all top-level features
		console.log(`${DBG} Beginning restoration of all top-level features (sample prov keys):`, provSample());
		for (const feature of found.classFeatures || []) {
			await restoreFeatureSelection(feature);
		}
	
		// Trigger Svelte reactivity
		featureSelections = { ...featureSelections };
		bumpVersion();
		console.log(`${DBG} Restoration complete. Final featureSelections:`, featureSelections);
	}); // end onMount


</script>



<div class="main-content">
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="class" />

	<p class="intro-text">
		In Dungeons & Dragons, your character's class determines what they can do. It marks what role
		your character will play in your party of adventurers. Each class has strengths and weaknesses,
		so its important to use teamwork!
	</p>

	{#if !selectedClassData}
		<div class="class-cards">
			{#each classes as classInfo}
				<button class="class-card" on:click={() => (selectedClass = classInfo)}>
					<div class="card-left">
						<img src={classInfo.image} alt={`${classInfo.name} icon`} />
						<span>{classInfo.name}</span>
					</div>
					<img class="card-arrow" src="{base}/basic_icons/blue_next.png" alt="next arrow" />
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedClass}
		<!-- Popup Preview -->
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD CLASS</span>
					<button class="close-button" on:click={() => (selectedClass = null)}>×</button>
				</div>

				<div class="popup-body">
					<!-- Class description remains a string -->
					<p class="description">{selectedClass.description}</p>

					<p><strong>Primary Ability:</strong> {selectedClass.primaryAbility}</p>

					{#each selectedClass.classFeatures as feature}
						<div class="feature-card">
							<h4>{feature.name}</h4>
							<FeatureDescription description={feature.description} />
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => (selectedClass = null)}>
						Cancel
					</button>
					<button class="add-button" on:click={confirmAddClass}>
						Add Class
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if selectedClassData}
		<!-- Selected class view -->
		<div class="selected-class-card">
			<div class="selected-class-info">
				<img
					src={selectedClassData.image}
					alt={`${selectedClassData.name} icon`}
					class="selected-class-icon"
				/>
				<div class="selected-class-text">
					<h2>{selectedClassData.name}</h2>
					<p class="max-hp">
						Average Health: {calculateMaxHP(selectedClassData.hitDie)}
					</p>
				</div>
				<button
					class="remove-class-button"
					on:click={removeSelectedClass}
					aria-label="Remove selected class"
				>
					✕
				</button>
			</div>

			<!-- Feature cards -->
			<FeatureCardList
				features={mergedFeatures}
				bind:featureSelections
				bind:expandedFeatures
				{selectionVersion}
				characterStore={character_store}
				onBumpVersion={() => selectionVersion++}
			/>
		</div>
	{/if}

</div>

<style>
	.main-content {
		padding: 2rem 1rem;
		padding-top: 80px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.intro-text {
		max-width: 50vw;
		margin: 0 auto;
		text-align: center;
		font-size: 1.1rem;
		color: #444;
	}

	.class-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
		gap: 1rem;
		margin-top: 2rem;
		padding: 0 2rem; /* increased horizontal padding for better visual spacing */
		width: 100%;
		align-items: start; /* align items to top of their grid area */
		box-sizing: border-box;
	}

	/* Responsive grid behavior - matches species page breakpoints */
	@media (max-width: 768px) {
		.class-cards {
			grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
			gap: 0.75rem; /* slightly smaller gap on tablets */
			padding: 0 1rem; /* medium padding on tablets */
		}
	}

	@media (max-width: 480px) {
		.class-cards {
			grid-template-columns: 1fr; /* single column on mobile */
			gap: 0.5rem; /* smaller gap on mobile */
			padding: 0 0.5rem; /* reduced padding on mobile */
		}
	}

	.class-card {
		width: 100%; /* fill grid cell */
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem; /* match species padding */
		font-size: 1.2rem;
		cursor: pointer;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		background-color: #f8f8f8;
		transition: background-color 0.2s ease;
		text-align: left;
		box-sizing: border-box;
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.class-card img {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}

	.card-arrow {
		width: 24px;
		height: 24px;
		object-fit: contain;
		margin-left: auto;
	}

	.class-card:hover,
	.class-card:focus {
		background-color: #e0e0e0;
		outline: none;
	}

	.class-card:focus {
		box-shadow: 0 0 0 3px rgba(100, 149, 237, 0.5);
	}

	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.popup-content {
		background: #fff;
		width: 50vw;
		height: 80vh;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
	}

	.popup-header {
		background: #222;
		color: white;
		padding: 12px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
	}

	.popup-body {
		padding: 16px;
		overflow-y: auto;
		flex: 1;
	}

	.description {
		font-size: 0.95rem;
		color: #555;
		margin-bottom: 0.2rem;
	}

	.selected-class-card {
		max-width: 50vw;
		margin: 2rem auto 1rem auto;
		padding: 1rem 1.5rem;
		border: 2px solid #888;
		border-radius: 8px;
		background-color: #fafafa;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}

	.selected-class-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.selected-class-icon {
		width: 60px;
		height: 60px;
		object-fit: contain;
		border-radius: 6px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}

	.selected-class-text {
		flex-grow: 1;
	}

	.selected-class-text h2 {
		margin: 0;
		font-weight: 700;
		font-size: 1.2rem;
	}

	.max-hp {
		font-size: 0.9rem;
		color: #666;
		margin-top: 4px;
	}

	.remove-class-button {
		font-size: 1.5rem;
		cursor: pointer;
		background: none;
		border: none;
		color: #c00;
		padding: 4px 8px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}
	.remove-class-button:hover {
		background-color: #fdd;
	}

	/* Feature card styling for popup content */
	.feature-card {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 12px;
		margin-top: 12px;
		background-color: #f9f9f9;
	}

	.feature-card h4 {
		margin: 0 0 8px 0;
		font-size: 1rem;
		font-weight: bold;
		color: #333;
	}

	.feature-card p {
		margin: 0;
		font-size: 0.9rem;
		color: #555;
		line-height: 1.4;
	}

	.popup-footer {
		padding: 12px 16px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		border-top: 1px solid #ddd;
		background: #f0f0f0;
	}

	.cancel-button {
		background-color: #333;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.cancel-button:hover {
		background-color: #555;
	}

	.add-button {
		background-color: #2e7d32;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.add-button:hover {
		background-color: #1b4d20;
	}
</style>
