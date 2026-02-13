/**
 * Feature Overflow Detection and Page Splitting
 * 
 * This module handles the logic for:
 * 1. Measuring text to see if it fits in a text area
 * 2. Splitting features between page 1 and page 2 when overflow occurs
 * 3. Prioritizing important features over minor features
 * 4. Sorting features by source (class first, then species)
 */

import type { Character } from '$lib/stores/character_store';
import { getFeatureData } from './feature-data';

export interface FeatureEntry {
	name: string;
	formattedText: string;
	importance: 'important' | 'minor';
	source: 'class' | 'race' | 'background' | 'feat' | 'subclass';
	estimatedLines: number;
}

/**
 * Estimate the number of lines a formatted feature will take
 * This is a simplified approximation based on:
 * - Counting newlines in the text
 * - Assuming worst-case wrapping for long lines
 * - Adding spacing between features
 * 
 * Note: This is intentionally conservative to prevent cut-off text.
 */
export function estimateFeatureLines(
	formattedText: string,
	maxWidth: number,
	fontSize: number,
	avgCharWidth: number = 4.8 // Calibrated for Helvetica 8pt based on "Damage Resistance. You have resistance to" = ~42 chars
): number {
	// Remove the [[BOLD:...]] markers for counting
	const cleanText = formattedText.replace(/\[\[BOLD:([^\]]+)\]\]/g, '$1');
	
	// Split by newlines (explicit line breaks in description)
	const lines = cleanText.split('\n');
	let totalLines = 0;
	
	// Calculate chars per line based on observed data:
	// "Damage Resistance. You have resistance to" = 42 chars fits in one line
	// width=165pt, fontSize=8pt -> roughly 42 chars per line
	const charsPerLine = 42; // Empirically determined
	
	for (const line of lines) {
		if (line.trim() === '') {
			totalLines += 1; // Empty line (separator)
			continue;
		}
		
		// Estimate how many lines this text will wrap to
		const estimatedLineCount = Math.ceil(line.length / charsPerLine);
		totalLines += estimatedLineCount;
	}
	
	// Add spacing between features (double newline = 1 extra line)
	totalLines += 1;
	
	return totalLines;
}

/**
 * Sort features by priority:
 * 1. Important features (class features first, then species features)
 * 2. Minor features (class features first, then species features)
 */
export function sortFeaturesByPriority(features: FeatureEntry[]): FeatureEntry[] {
	return features.sort((a, b) => {
		// First, sort by importance (important before minor)
		if (a.importance !== b.importance) {
			return a.importance === 'important' ? -1 : 1;
		}
		
		// Within same importance, sort by source (class before species/race)
		if (a.source !== b.source) {
			if (a.source === 'class') return -1;
			if (b.source === 'class') return 1;
			if (a.source === 'race') return -1;
			if (b.source === 'race') return 1;
		}
		
		// Keep original order if same importance and source
		return 0;
	});
}

/**
 * Split features between page 1 and page 2 based on available space
 * 
 * @param features - Sorted array of feature entries
 * @param maxLinesPage1 - Maximum lines available on page 1 (approx 60 lines for the config)
 * @returns Object with page1Features and page2Features arrays
 */
export function splitFeaturesByPage(
	features: FeatureEntry[],
	maxLinesPage1: number
): {
	page1Features: string[];
	page2Features: string[];
	page1Count: number;
	page2Count: number;
} {
	const page1Features: string[] = [];
	const page2Features: string[] = [];
	let currentLines = 0;
	
	for (const feature of features) {
		const featureLines = feature.estimatedLines;
		
		console.log(`[splitFeaturesByPage] Evaluating: "${feature.name}"`);
		console.log(`  Importance: ${feature.importance}, Source: ${feature.source}`);
		console.log(`  Estimated lines: ${featureLines}`);
		console.log(`  Current lines used: ${currentLines} / ${maxLinesPage1}`);
		console.log(`  Space needed: ${currentLines + featureLines} / ${maxLinesPage1}`);
		
		// Check if this feature fits on page 1
		if (currentLines + featureLines <= maxLinesPage1) {
			console.log(`  ✓ FITS on page 1`);
			page1Features.push(feature.formattedText);
			currentLines += featureLines;
		} else {
			console.log(`  ✗ OVERFLOW to page 2 (would exceed by ${(currentLines + featureLines) - maxLinesPage1} lines)`);
			// Feature doesn't fit - goes to page 2
			// Don't add it to page 1 even partially (no half-cut features)
			page2Features.push(feature.formattedText);
		}
	}
	
	return {
		page1Features,
		page2Features,
		page1Count: page1Features.length,
		page2Count: page2Features.length
	};
}

/**
 * Prepare features for PDF export with overflow handling
 * 
 * @param featureNames - Raw feature names from character store
 * @param character - Character object for context
 * @param formatFeatureFn - Function to format a single feature
 * @param maxLinesPage1 - Max lines available on page 1 (default: 60)
 * @param textAreaConfig - Configuration for text area (width, fontSize)
 * @returns Object with formatted text for page 1 and page 2
 */
export function prepareFeaturesWithOverflow(
	featureNames: string[],
	character: Character | undefined,
	formatFeatureFn: (name: string, character?: Character) => string,
	maxLinesPage1: number = 60,
	textAreaConfig: { width: number; fontSize: number }
): {
	page1Text: string;
	page2Text: string;
	hasOverflow: boolean;
	stats: {
		totalFeatures: number;
		importantCount: number;
		minorCount: number;
		page1Count: number;
		page2Count: number;
	};
} {
	console.log('=== prepareFeaturesWithOverflow ===');
	console.log('Input features:', featureNames);
	
	if (!featureNames || featureNames.length === 0) {
		return {
			page1Text: 'No features or traits.',
			page2Text: '',
			hasOverflow: false,
			stats: {
				totalFeatures: 0,
				importantCount: 0,
				minorCount: 0,
				page1Count: 0,
				page2Count: 0
			}
		};
	}
	
	// Build feature entries with metadata
	const featureEntries: FeatureEntry[] = [];
	let importantCount = 0;
	let minorCount = 0;
	
	for (const name of featureNames) {
		const featureData = getFeatureData(name, character);
		if (!featureData) {
			console.warn(`Could not find feature data for: ${name}`);
			continue;
		}
		
		// Skip invisible features
		const importance = featureData.importance || 'important';
		if (importance === 'invisible') {
			console.log(`Skipping invisible feature: ${name}`);
			continue;
		}
		
		// Format the feature
		const formattedText = formatFeatureFn(name, character);
		
		// Estimate lines
		const estimatedLines = estimateFeatureLines(
			formattedText,
			textAreaConfig.width,
			textAreaConfig.fontSize
		);
		
		console.log(`[prepareFeaturesWithOverflow] Feature: "${name}"`);
		console.log(`  Importance: ${importance}, Source: ${featureData.source}`);
		console.log(`  Formatted text length: ${formattedText.length} chars`);
		console.log(`  Estimated lines: ${estimatedLines}`);
		
		featureEntries.push({
			name,
			formattedText,
			importance: importance as 'important' | 'minor',
			source: featureData.source,
			estimatedLines
		});
		
		if (importance === 'important') {
			importantCount++;
		} else if (importance === 'minor') {
			minorCount++;
		}
	}
	
	console.log(`Feature entries created: ${featureEntries.length}`);
	console.log(`  Important: ${importantCount}, Minor: ${minorCount}`);
	
	// Sort by priority
	const sortedFeatures = sortFeaturesByPriority(featureEntries);
	console.log('Features sorted by priority');
	
	// Split between pages
	const split = splitFeaturesByPage(sortedFeatures, maxLinesPage1);
	
	console.log(`Split result: Page 1: ${split.page1Count}, Page 2: ${split.page2Count}`);
	
	return {
		page1Text: split.page1Features.join('\n\n'),
		page2Text: split.page2Features.length > 0 
			? split.page2Features.join('\n\n')
			: '',
		hasOverflow: split.page2Features.length > 0,
		stats: {
			totalFeatures: featureEntries.length,
			importantCount,
			minorCount,
			page1Count: split.page1Count,
			page2Count: split.page2Count
		}
	};
}
