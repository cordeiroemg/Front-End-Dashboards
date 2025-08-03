/* =======================================================
   SET 14: C (Plotly Version)
======================================================= */

function sim3_plotSexRatioEffect() {
	const set14_totalFemales = 100
	const set14_maleCounts = Array.from({ length: 100 }, (_, i) => i + 1)
	const set14_effectiveSizes = set14_maleCounts.map(
		(set14_Nm) =>
			(4 * set14_Nm * set14_totalFemales) / (set14_Nm + set14_totalFemales)
	)

	const set14_traceEffective = {
		x: set14_maleCounts,
		y: set14_effectiveSizes,
		mode: 'lines',
		name: 'Effective Ne',
		line: { width: 2 },
	}

	const set14_traceIdeal = {
		x: [1, 100],
		y: [100, 100],
		mode: 'lines',
		name: 'Ideal Ne (Nm = Nf = 100)',
		line: { dash: 'dash', color: 'gray' },
	}

	const set14_layoutSex = {
		xaxis: { title: 'Number of Males (Nm)' },
		yaxis: { title: 'Effective Population Size (Ne)' },
		title: 'Effect of Sex Ratio on Ne',
		margin: { t: 50 },
	}

	Plotly.newPlot(
		'sim3_sexRatioPlot',
		[set14_traceEffective, set14_traceIdeal],
		set14_layoutSex
	)
}

function sim3_plotHeterozygosityFluctuation() {
	const set14_numGenerations = 20
	const set14_initialH = 0.5
	const set14_randomSizes = Array.from(
		{ length: set14_numGenerations },
		() => Math.floor(Math.random() * (200 - 30 + 1)) + 30
	)

	const set14_heterozygosities = [set14_initialH]
	for (let set14_i = 1; set14_i < set14_numGenerations; set14_i++) {
		const set14_prevH = set14_heterozygosities[set14_i - 1]
		const set14_prevSize = set14_randomSizes[set14_i - 1]
		set14_heterozygosities.push(set14_prevH * (1 - 1 / (2 * set14_prevSize)))
	}

	const set14_traceH = {
		x: Array.from({ length: set14_numGenerations }, (_, i) => i),
		y: set14_heterozygosities,
		mode: 'lines+markers',
		name: 'Heterozygosity',
		marker: { symbol: 'circle', size: 6 },
		line: { width: 2 },
	}

	const set14_layoutFluct = {
		title: 'Heterozygosity Decay with Fluctuating Population Sizes',
		xaxis: { title: 'Generation' },
		yaxis: { title: 'Heterozygosity (H)' },
		margin: { t: 60 },
	}

	Plotly.newPlot('sim3_heterozygosityPlot', [set14_traceH], set14_layoutFluct)
}

function sim3_plotProgenyVarianceEffect() {
	const set14_constantN = 100
	const set14_sigma2Range = Array.from(
		{ length: 100 },
		(_, i) => 0.1 + ((10 - 0.1) * i) / 99
	)
	const set14_effectiveSizesVar = set14_sigma2Range.map(
		(set14_sigma2) => (4 * set14_constantN - 2) / (set14_sigma2 + 2)
	)

	const set14_traceVar = {
		x: set14_sigma2Range,
		y: set14_effectiveSizesVar,
		mode: 'lines',
		name: 'Effective Ne',
		line: { width: 2 },
	}

	const set14_layoutVar = {
		title: 'Effect of Progeny Variance on Ne',
		xaxis: { title: 'Variance in Progeny Number (σ²)' },
		yaxis: { title: 'Effective Population Size (Ne)' },
		margin: { t: 60 },
	}

	Plotly.newPlot('sim3_variancePlot', [set14_traceVar], set14_layoutVar)
}
