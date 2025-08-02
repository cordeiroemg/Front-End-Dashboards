/* =======================================================
   SET 1: Fibonacci-Based Decrease in Heterozygosity
======================================================= */
function simulateFibonacciHeterozygosity() {
	const generations = 10
	const H_t = new Array(generations + 1).fill(0)
	H_t[0] = 1.0

	const fib = [1, 2]
	for (let i = 2; i <= generations; i++) {
		fib.push(fib[i - 1] + fib[i - 2])
	}

	for (let t = 1; t <= generations; t++) {
		H_t[t] = fib[t] / Math.pow(2, t)
	}

	const P = H_t.map((ht) => ht / H_t[0])
	const f_vals = P.map((p) => 1 - p)
	const rate_change = H_t.slice(1).map((ht, i) => ht / H_t[i])
	const delta_rate = rate_change.map((rc) => 1 - rc)

	Plotly.newPlot(
		'plotRelativeHeterozygosity',
		[
			{
				x: Array.from({ length: generations + 1 }, (_, k) => k),
				y: P,
				mode: 'lines+markers',
				name: 'Relative Heterozygosity (P)',
			},
		],
		{
			title: 'Relative Heterozygosity (P)',
			xaxis: { title: 'Generation' },
			yaxis: { title: 'Relative Heterozygosity (P)' },
		}
	)

	Plotly.newPlot(
		'plotDecreaseHeterozygosity',
		[
			{
				x: Array.from({ length: generations + 1 }, (_, k) => k),
				y: f_vals,
				mode: 'lines+markers',
				name: 'Decrease in Heterozygosity (f)',
			},
		],
		{
			title: 'Decrease in Heterozygosity (f)',
			xaxis: { title: 'Generation' },
			yaxis: { title: 'Decrease in Heterozygosity (f)' },
		}
	)

	Plotly.newPlot(
		'plotRateOfChange',
		[
			{
				x: Array.from({ length: generations + 1 }, (_, k) => k),
				y: [null, ...rate_change],
				mode: 'lines+markers',
				name: 'Rate of Change (H_t / H_{t-1})',
			},
		],
		{
			title: 'Rate of Change (H_t / H_{t-1})',
			xaxis: { title: 'Generation' },
			yaxis: { title: 'Rate of Change' },
		}
	)

	Plotly.newPlot(
		'plotDeltaRate',
		[
			{
				x: Array.from({ length: generations + 1 }, (_, k) => k),
				y: [null, ...delta_rate],
				mode: 'lines+markers',
				name: 'Delta Rate (1 - H_t / H_{t-1})',
			},
		],
		{
			title: 'Delta Rate (1 - H_t / H_{t-1})',
			xaxis: { title: 'Generation' },
			yaxis: { title: 'Delta Rate' },
		}
	)
}

/* =======================================================
   SET 2: Genotype Frequencies and Heterozygosity
======================================================= */
function simulateInbreedingGenotypes() {
	const p1 = 0.6,
		p2 = 1 - p1
	const inbreedingValues = Array.from({ length: 100 }, (_, k) => k / 100)
	const H0 = 2 * p1 * p2

	const AA = inbreedingValues.map((fi) => p1 ** 2 * (1 - fi) + p1 * fi)
	const Aa = inbreedingValues.map((fi) => 2 * p1 * p2 * (1 - fi))
	const aa = inbreedingValues.map((fi) => p2 ** 2 * (1 - fi) + p2 * fi)
	const H_f = inbreedingValues.map((fi) => H0 * (1 - fi))

	Plotly.newPlot(
		'plotGenotypeFrequencies',
		[
			{
				x: inbreedingValues,
				y: AA,
				mode: 'lines',
				name: 'A1A1',
				line: { color: 'blue' },
			},
			{
				x: inbreedingValues,
				y: Aa,
				mode: 'lines',
				name: 'A1A2',
				line: { color: 'green' },
			},
			{
				x: inbreedingValues,
				y: aa,
				mode: 'lines',
				name: 'A2A2',
				line: { color: 'red' },
			},
		],
		{
			title: 'Genotype Frequencies vs Inbreeding Coefficient (f)',
			xaxis: { title: 'Inbreeding Coefficient (f)' },
			yaxis: { title: 'Genotype Frequency' },
		}
	)

	Plotly.newPlot(
		'plotHeterozygosity',
		[
			{
				x: inbreedingValues,
				y: H_f,
				mode: 'lines',
				name: 'Heterozygosity (Hf)',
				line: { color: 'purple' },
			},
			{
				x: [0, 1],
				y: [H0, H0],
				mode: 'lines',
				name: 'H0 (Random Mating)',
				line: { color: 'gray', dash: 'dash' },
			},
		],
		{
			title: 'Expected Heterozygosity vs Inbreeding Coefficient (f)',
			xaxis: { title: 'Inbreeding Coefficient (f)' },
			yaxis: { title: 'Heterozygosity' },
		}
	)
}

/* =======================================================
   SET 3: Gamete Correlation Calculation
======================================================= */
function simulateGameteCorrelation() {
	const p1 = 0.7,
		p2 = 1 - p1
	const inbreedingValues = Array.from({ length: 100 }, (_, k) => k / 100)
	const r_values = []

	inbreedingValues.forEach((fi) => {
		const freq_A1A1 = p1 ** 2 * (1 - fi) + p1 * fi
		const freq_A1A2 = p1 * p2 * (1 - fi)
		const freq_A2A1 = p2 * p1 * (1 - fi)
		const freq_A2A2 = p2 ** 2 * (1 - fi) + p2 * fi

		const data = [
			[0, 0, freq_A2A2],
			[1, 0, freq_A1A2],
			[0, 1, freq_A2A1],
			[1, 1, freq_A1A1],
		]
		const X = data.map((d) => d[0]),
			Y = data.map((d) => d[1]),
			freq = data.map((d) => d[2])

		const EX = X.reduce((sum, xi, i) => sum + xi * freq[i], 0)
		const EY = Y.reduce((sum, yi, i) => sum + yi * freq[i], 0)
		const EXY = X.reduce((sum, xi, i) => sum + xi * Y[i] * freq[i], 0)
		const EX2 = X.reduce((sum, xi, i) => sum + xi ** 2 * freq[i], 0)
		const EY2 = Y.reduce((sum, yi, i) => sum + yi ** 2 * freq[i], 0)
		const var_X = EX2 - EX ** 2,
			var_Y = EY2 - EY ** 2,
			cov_XY = EXY - EX * EY
		const r = var_X * var_Y > 0 ? cov_XY / Math.sqrt(var_X * var_Y) : 0

		r_values.push(r)
	})

	Plotly.newPlot(
		'plotCorrelation',
		[
			{
				x: inbreedingValues,
				y: r_values,
				mode: 'lines',
				name: 'Computed r',
				line: { color: 'blue' },
			},
			{
				x: inbreedingValues,
				y: inbreedingValues,
				mode: 'lines',
				name: 'r = f (Identity)',
				line: { color: 'black', dash: 'dash' },
			},
		],
		{
			title: 'Inbreeding Coefficient (f) vs Gamete Correlation (r)',
			xaxis: { title: 'Inbreeding Coefficient (f)' },
			yaxis: { title: 'Correlation Coefficient (r)' },
		}
	)
}

/* =======================================================
   SET 4: Proportion Affected by Consanguineous Marriages
======================================================= */
function runKPlot() {
	const p_values = Array.from({ length: 101 }, (_, i) =>
		Math.pow(
			10,
			Math.log10(0.0001) + (i * (Math.log10(0.1) - Math.log10(0.0001))) / 100
		)
	)
	const c = 0.01
	const f_par = 1 / 16
	const f_bar_values = [0.0001, 0.001, 0.005, 0.01]

	function compute_K(p, c, f_par, f_bar) {
		return (c * (p + (1 - p) * f_par)) / (p + f_bar)
	}

	const data = f_bar_values.map((f_bar) => ({
		x: p_values,
		y: p_values.map((p) => compute_K(p, c, f_par, f_bar)),
		type: 'scatter',
		mode: 'lines',
		name: `f̄ = ${f_bar}`,
		line: { width: 2 },
	}))

	const layout = {
		title: 'Proportion of Affected Individuals from Consanguineous Marriages',
		xaxis: { type: 'log', title: 'Recessive Allele Frequency (p)' },
		yaxis: { title: 'Proportion K of Affected from Consanguineous Marriages' },
		showlegend: true,
	}

	Plotly.newPlot('chart', data, layout)
}

/* =======================================================
   SET 5: Epistasis and Inbreeding Performance Chart (Plotly Version)
======================================================= */
function runEpistasisChart() {
	const container = document.getElementById('performanceChart')
	if (!container) return

	const epi_f = Array.from({ length: 100 }, (_, i) => i / 99)
	const epi_G = 10
	const epi_H = 2
	const epi_M_diminishing = 1
	const epi_M_reinforcing = -1

	const epi_performance_none = epi_f.map((x) => epi_G - epi_H * x)
	const epi_performance_diminishing = epi_f.map(
		(x) => epi_G - epi_H * x + epi_M_diminishing * x * x
	)
	const epi_performance_reinforcing = epi_f.map(
		(x) => epi_G - epi_H * x + epi_M_reinforcing * x * x
	)

	const data = [
		{
			x: epi_f,
			y: epi_performance_none,
			mode: 'lines',
			name: 'No Epistasis (Linear Decline)',
			line: { color: 'blue', width: 2 },
		},
		{
			x: epi_f,
			y: epi_performance_diminishing,
			mode: 'lines',
			name: 'Diminishing Epistasis (Concave Up)',
			line: { color: 'orange', width: 2, dash: 'dash' },
		},
		{
			x: epi_f,
			y: epi_performance_reinforcing,
			mode: 'lines',
			name: 'Reinforcing Epistasis (Concave Down)',
			line: { color: 'red', width: 2, dash: 'dot' },
		},
	]

	const layout = {
		title: 'Performance under Different Epistasis Scenarios',
		xaxis: {
			title: 'Inbreeding Coefficient (f)',
		},
		yaxis: {
			title: 'Performance (or Trait Value)',
		},
		legend: {
			orientation: 'h',
			xanchor: 'center',
			x: 0.5,
			y: -0.3,
		},
		margin: { t: 50, b: 60 },
	}

	Plotly.newPlot(container, data, layout, { responsive: true })
}

/* =======================================================
   SET 6: C (Plotly Version)
======================================================= */

// simulation3.js

// Gera 100 valores igualmente espaçados entre 0 e 1
function linspace(start, stop, num) {
	const arr = []
	const step = (stop - start) / (num - 1)
	for (let i = 0; i < num; i++) {
		arr.push(start + step * i)
	}
	return arr
}

// Calcula todos os modelos com base nos coeficientes de endogamia
function simulateModels() {
	const inbreedingCoefficients = linspace(0, 1, 100)
	const models = {
		'Model 1 & 2: No dominance, no inbreeding effect':
			inbreedingCoefficients.map(() => 10.0),
		'Model 3 & 4: Dominance only (linear)': inbreedingCoefficients.map(
			(x) => 10 - 2 * x
		),
		'Model 5: Reinforcing epistasis': inbreedingCoefficients.map(
			(x) => 10 - 0.007 * x - 0.032 * x ** 2
		),
		'Model 6: Diminishing epistasis': inbreedingCoefficients.map(
			(x) => 10 - 0.356 * x + 0.032 * x ** 2
		),
		'Model 7 & 8: Epistasis without nonlinearity': inbreedingCoefficients.map(
			(x) => 10 - 2 * x
		),
		'Model 9: Strong reinforcing epistasis': inbreedingCoefficients.map(
			(x) => 10 - 0.5 * x - 0.5 * x ** 2
		),
	}

	return { inbreedingCoefficients, models }
}

// Plota os modelos com Plotly.js
function plotModelsPlotly(divId) {
	const { inbreedingCoefficients, models } = simulateModels()

	const colors = [
		'#1f77b4',
		'#ff7f0e',
		'#2ca02c',
		'#d62728',
		'#9467bd',
		'#8c564b',
		'#e377c2',
		'#7f7f7f',
		'#bcbd22',
	]

	const dashes = [
		'dash',
		'solid',
		'dot',
		'dashdot',
		'solid',
		'dash',
		'dot',
		'solid',
		'dot',
	]

	const traces = Object.keys(models).map((label, i) => ({
		x: inbreedingCoefficients,
		y: models[label],
		mode: 'lines',
		name: label,
		line: {
			color: colors[i % colors.length],
			dash: dashes[i % dashes.length],
			width: 2,
		},
	}))

	const layout = {
		title: 'Effects of Inbreeding on Phenotype Under Different Genetic Models',
		xaxis: {
			title: 'Inbreeding Coefficient (f)',
			range: [0, 1],
		},
		yaxis: {
			title: 'Performance / Trait Value (Ȳ)',
		},
		legend: {
			orientation: 'h',
			x: 0,
			y: -0.2,
		},
		margin: { t: 60 },
	}

	Plotly.newPlot(divId, traces, layout, { responsive: true })
}

/* =======================================================
   SET 7: C (Plotly Version)
======================================================= */

// Gera uma sequência de inteiros de start a end, inclusive
function range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Calcula heterozigosidade sob autofecundação
function computeSelfFertilization(generations, H0 = 1.0) {
	return generations.map((t) => H0 * Math.pow(0.5, t))
}

// Calcula heterozigosidade sob cruzamento entre irmãos
function computeSibMating(generations, H0 = 1.0) {
	const H = new Array(generations.length).fill(0)
	H[0] = H0
	H[1] = H0 / 2
	for (let t = 2; t < generations.length; t++) {
		H[t] = 0.5 * H[t - 1] + 0.25 * H[t - 2]
	}
	return H
}

// Função para plotar os dois modelos usando Plotly
function plotHeterozygosityDecline(divId) {
	const generations = range(0, 20)
	const H_self = computeSelfFertilization(generations)
	const H_sib = computeSibMating(generations)

	const traceSelf = {
		x: generations,
		y: H_self,
		type: 'scatter',
		mode: 'lines+markers',
		name: 'Self-fertilization',
		marker: { symbol: 'circle', size: 6 },
		line: { color: '#1f77b4' },
	}

	const traceSib = {
		x: generations,
		y: H_sib,
		type: 'scatter',
		mode: 'lines+markers',
		name: 'Sib-mating',
		marker: { symbol: 'square', size: 6 },
		line: { color: '#ff7f0e' },
	}

	const layout = {
		title: 'Decline in Heterozygosity under Different Inbreeding Systems',
		xaxis: {
			title: 'Generation',
			dtick: 1,
		},
		yaxis: {
			title: 'Heterozygosity (( H_t ))',
			range: [0, 1],
		},
		legend: { x: 0.05, y: 1.0 },
		margin: { t: 60 },
	}

	Plotly.newPlot(divId, [traceSelf, traceSib], layout, { responsive: true })
}

/* =======================================================
   SET 8: C (Plotly Version)
======================================================= */

// Gera uma sequência de inteiros de start a end (inclusive)
function range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Calcula heterozigosidade com autofecundação parcial para diferentes valores de S
function computePartialSelfFertilization(S_values, generations = 50, H0 = 1.0) {
	const heterozygosities = {}
	const equilibriumLines = {}

	S_values.forEach((S) => {
		const H = [H0]
		const equilibrium = ((2 * (1 - S)) / (2 - S)) * H0

		for (let t = 1; t <= generations; t++) {
			const H_t = (S / 2) * H[t - 1] + (1 - S) * H0
			H.push(H_t)
		}

		heterozygosities[S] = H
		equilibriumLines[S] = equilibrium
	})

	return { heterozygosities, equilibriumLines }
}

// Plota os resultados com Plotly.js
function plotPartialSelfing(divId) {
	const S_values = [1.0, 0.5, 0.1]
	const generations = 50
	const H0 = 1.0
	const x = range(0, generations)
	const { heterozygosities, equilibriumLines } =
		computePartialSelfFertilization(S_values, generations, H0)

	const traces = []

	S_values.forEach((S) => {
		traces.push({
			x,
			y: heterozygosities[S],
			mode: 'lines',
			name: `S = ${S}`,
			line: { width: 2 },
		})

		traces.push({
			x,
			y: Array(x.length).fill(equilibriumLines[S]),
			mode: 'lines',
			name: `Equilibrium for S = ${S}`,
			line: {
				dash: 'dash',
				color: 'gray',
				width: 1,
			},
			showlegend: S === 0.1, // mostrar só uma linha de equilíbrio com legenda
		})
	})

	const layout = {
		title: 'Decline in Heterozygosity with Partial Self-Fertilization',
		xaxis: {
			title: 'Generation',
			dtick: 5,
		},
		yaxis: {
			title: {
				text: 'Heterozygosity (H)',
			},
			range: [0, 1],
		},
		legend: {
			x: 0.05,
			y: 1.0,
		},
		margin: { t: 60 },
	}

	Plotly.newPlot(divId, traces, layout, { responsive: true })
}

/* =======================================================
   SET 9: C (Plotly Version)
======================================================= */

// Função principal: plota a conversão genômica e o tamanho da região intacta
function plotBackcrossingConversion(divId) {
	const generations = range(1, 20)
	const recurrentFraction = generations.map((t) => 1 - Math.pow(0.5, t))
	const intactInterval = generations.map((t) => 100 / t)

	const trace1 = {
		x: generations,
		y: recurrentFraction,
		name: 'Recurrent Genome Fraction',
		mode: 'lines+markers',
		marker: { symbol: 'circle', color: 'blue' },
		line: { color: 'blue' },
		yaxis: 'y1',
		hovertemplate: 'Generation %{x}<br>Recurrent: %{y:.2f}<extra></extra>',
	}

	const trace2 = {
		x: generations,
		y: intactInterval,
		name: 'Intact Region Size',
		mode: 'lines+markers',
		marker: { symbol: 'square', color: 'red' },
		line: { dash: 'dash', color: 'red' },
		yaxis: 'y2',
		hovertemplate: 'Generation %{x}<br>Region Size: %{y:.2f} mu<extra></extra>',
	}

	const layout = {
		title:
			'Repeated Backcrossing: Genome Conversion and Linked Segment Retention',
		xaxis: {
			title: 'Backcross Generations (t)',
			dtick: 1,
		},
		yaxis: {
			title: 'Proportion from Recurrent Parent (1 - 0.5^t)',
			range: [0, 1.05],
			titlefont: { color: 'blue' },
			tickfont: { color: 'blue' },
		},
		yaxis2: {
			title: 'Mean Size of Intact Region (map units)',
			overlaying: 'y',
			side: 'right',
			titlefont: { color: 'red' },
			tickfont: { color: 'red' },
			range: [0, Math.max(...intactInterval) + 5],
		},
		legend: {
			x: 0.5,
			y: -0.2,
			xanchor: 'center',
			orientation: 'h',
		},
		margin: { t: 60 },
	}

	Plotly.newPlot(divId, [trace1, trace2], layout, { responsive: true })
}

/* =======================================================
   SET 10: C (Plotly Version)
======================================================= */

// Gera uma sequência de inteiros de start a end (inclusive)
function range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Calcula o tempo médio até recombinação
function averageGenerationsUntilRecombination(r) {
	return 1 / r
}

// Plota o gráfico de substituição genômica e tamanho da região ligada
function plotGenomeReplacementAndLinkage(divId) {
	const generations = range(1, 30) // 1 to 30
	const recurrentProp = generations.map((t) => 1 - Math.pow(0.5, t))
	const segmentSize = generations.map((t) => 100 / t)

	const trace1 = {
		x: generations,
		y: recurrentProp,
		name: 'Recurrent Genome Proportion',
		mode: 'lines',
		line: { color: 'blue', width: 2 },
	}

	const trace2 = {
		x: generations,
		y: segmentSize,
		name: 'Mean Linked Segment Size (map units)',
		mode: 'lines',
		line: { color: 'red', dash: 'dash' },
	}

	const layout = {
		title: 'Genome Replacement and Linkage Decay During Backcrossing',
		xaxis: {
			title: 'Generation',
		},
		yaxis: {
			title: 'Proportion / Segment Size',
			range: [0, 1.05 * Math.max(...segmentSize)],
		},
		legend: {
			x: 0.5,
			y: 1.1,
			xanchor: 'center',
			orientation: 'h',
		},
		margin: { t: 60 },
	}

	Plotly.newPlot(divId, [trace1, trace2], layout, { responsive: true })
}

// Plota o gráfico de barras para número médio de gerações com ligação
function plotLinkageDurationWithR015(divId) {
	const r_values = [0.01, 0.05, 0.1, 0.15, 0.2]
	const x_labels = r_values.map((r) => r.toFixed(2)) // ['0.01', '0.05', ..., '0.15', '0.20']
	const durations = r_values.map((r) => 1 / r) // [100, 20, 10, 6.67, 5]

	const trace = {
		x: x_labels,
		y: durations,
		type: 'bar',
		marker: {
			color: 'green',
		},
		hovertemplate: 'r = %{x}<br>Avg Gens Linked: %{y:.2f}<extra></extra>',
	}

	const layout = {
		title: 'Duration of Linkage to Introgressed Gene',
		xaxis: {
			title: 'Recombination Rate (r)',
			type: 'category', // evita valores interpolados como 0.13, 0.17 etc.
		},
		yaxis: {
			title: 'Avg Generations Linked',
			rangemode: 'tozero',
		},
		margin: { t: 60 },
	}

	Plotly.newPlot(divId, [trace], layout, { responsive: true })
}

/* =======================================================
   SET 11: C (Plotly Version)
======================================================= */

function simulateInbreedingDoubleHomozygosity() {
	const f_vals = Array.from({ length: 100 }, (_, i) => (i * 0.25) / 99)

	// Parâmetros fixos
	const p = 0.1,
		q = 1 - p
	const r = 0.1,
		s = 1 - r
	const phi = 0.01
	const V_f = 0.01

	// Cálculo das curvas
	const P_basic = f_vals.map((f) => (p ** 2 + f * p * q) * (r ** 2 + f * r * s))
	const P_extended = P_basic.map((val, i) => val + (phi + V_f) * p * q * r * s)

	const trace_basic = {
		x: f_vals,
		y: P_basic,
		mode: 'lines',
		name: 'P_basic (no linkage, uniform inbreeding)',
		line: { color: 'blue' },
	}

	const trace_extended = {
		x: f_vals,
		y: P_extended,
		mode: 'lines',
		name: 'P_extended (linkage + inbreeding variance)',
		line: { color: 'orange', dash: 'dash' },
	}

	const layout = {
		title: 'Effect of Linkage and Inbreeding Variance on Double Homozygosity',
		xaxis: {
			title: 'Inbreeding coefficient (f)',
			range: [0, 0.25],
		},
		yaxis: {
			title: 'P(AABB)',
		},
		legend: {
			x: 0.01,
			y: 0.99,
			bgcolor: 'rgba(255,255,255,0.5)',
		},
		margin: { t: 50, b: 50, l: 70, r: 30 },
	}

	Plotly.newPlot(
		'inbreedingDoubleHomozygosity',
		[trace_basic, trace_extended],
		layout
	)
}

/* =======================================================
   SET 11: C (Plotly Version)
======================================================= */

function plotInbreedingMeanVarianceSim3() {
	// Parâmetros
	const sim3_f_vals = Array.from({ length: 200 }, (_, i) => i / 199)
	const sim3_A = 1
	const sim3_p = 0.3
	const sim3_q = 1 - sim3_p
	const sim3_V0 = 2 * sim3_p * sim3_q * sim3_A ** 2
	const sim3_D = 0.5 * sim3_A

	// Médias fenotípicas
	const sim3_Y0 =
		2 * sim3_p * sim3_q * sim3_D + (sim3_q ** 2 - sim3_p ** 2) * sim3_A
	const sim3_Y1 = (sim3_q - sim3_p) * sim3_A
	const sim3_mean_Y = sim3_f_vals.map((f) => sim3_Y0 + f * (sim3_Y1 - sim3_Y0))

	// Variância com dominância
	const sim3_V1 = sim3_p * sim3_A ** 2 + sim3_q * sim3_A ** 2 - sim3_Y1 ** 2
	const sim3_var_Y_dominance = sim3_f_vals.map(
		(f) =>
			(1 - f) * sim3_V0 + f * sim3_V1 + f * (1 - f) * (sim3_Y1 - sim3_Y0) ** 2
	)

	// Variância sem dominância
	const sim3_var_Y_nodominance = sim3_f_vals.map((f) => sim3_V0 * (1 + f))

	// Layout
	const layout = {
		title: 'Effect of Inbreeding on Phenotypic Mean and Variance',
		xaxis: {
			title: 'Inbreeding Coefficient (f)',
			tickformat: '.2f',
		},
		yaxis: {
			title: 'Phenotypic Value / Variance',
			tickformat: '.3f',
		},
		legend: {
			x: 0.02,
			y: 1.15,
		},
		margin: { t: 60 },
	}

	// Traces
	const trace1 = {
		x: sim3_f_vals,
		y: sim3_var_Y_dominance,
		type: 'scatter',
		mode: 'lines',
		name: 'Variance (with dominance) \\( V_f = (1−f)V_0 + fV_1 + f(1−f)(Y_0−Y_1)^2 \\)',
		line: { color: 'blue' },
	}

	const trace2 = {
		x: sim3_f_vals,
		y: sim3_var_Y_nodominance,
		type: 'scatter',
		mode: 'lines',
		name: 'Variance (no dominance) \\( V_f = V_0 (1+f) \\)',
		line: { color: 'green', dash: 'dash' },
	}

	const trace3 = {
		x: sim3_f_vals,
		y: sim3_mean_Y,
		type: 'scatter',
		mode: 'lines',
		name: 'Mean phenotype \\( Y_f = Y_0 + (Y_1 - Y_0)f \\)',
		line: { color: 'red', dash: 'dot' },
	}

	// Plot
	Plotly.newPlot(
		'inbreedingVarianceChartSim3',
		[trace1, trace2, trace3],
		layout,
		{ responsive: true }
	)
}

/* =======================================================
   SET 12: C (Plotly Version)
======================================================= */

function renderInbreedingDominanceVarianceChartSim3() {
	const p_dom = 0.3
	const q_dom = 1 - p_dom
	const A_dom = 1
	const D_values_dom = [0, 0.2, 0.5, 1.0]
	const f_vals_dom = Array.from({ length: 200 }, (_, i) => i / 199)

	const traces_dom = D_values_dom.map((D) => {
		const Y0 = p_dom ** 2 * -A_dom + 2 * p_dom * q_dom * D + q_dom ** 2 * A_dom
		const Y1 = p_dom * -A_dom + q_dom * A_dom
		const V0 =
			p_dom ** 2 * A_dom ** 2 +
			2 * p_dom * q_dom * D ** 2 +
			q_dom ** 2 * A_dom ** 2 -
			Y0 ** 2
		const V1 = p_dom * A_dom ** 2 + q_dom * A_dom ** 2 - Y1 ** 2

		const V_f = f_vals_dom.map(
			(f) => (1 - f) * V0 + f * V1 + f * (1 - f) * (Y0 - Y1) ** 2
		)

		return {
			x: f_vals_dom,
			y: V_f,
			mode: 'lines',
			name: `Dominance D = ${D}`,
			line: { width: 2 },
		}
	})

	const layout_dom = {
		title: 'Effect of Inbreeding on Variance under Different Dominance Levels',
		xaxis: { title: 'Inbreeding Coefficient (f)' },
		yaxis: { title: 'Phenotypic Variance' },
		legend: { x: 0, y: 1 },
		margin: { t: 50 },
	}

	Plotly.newPlot('inbreedingDominanceVarianceChartSim3', traces_dom, layout_dom)
}

/* =======================================================
   SET 13: C (Plotly Version)
======================================================= */

function plotHeterozygosityDrift() {
	const traceData = [
		{
			x: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
				20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
				38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
			],
			y: [
				1.0, 0.75, 0.5625, 0.421875, 0.31640625, 0.2373046875, 0.177978515625,
				0.13348388671875, 0.1001129150390625, 0.07508468627929688,
				0.056313514709472656, 0.04223513603210449, 0.03167635202407837,
				0.023757264018058777, 0.017817948013544083, 0.013363461010158062,
				0.010022595757618547, 0.00751694681821391, 0.005637710113660433,
				0.004228282585245324, 0.003171211938934043, 0.002378408954200532,
				0.0017838067156503992, 0.0013378550367377994, 0.0010033912775533496,
				0.0007525434581650122, 0.0005644075936237592, 0.0004233056952178194,
				0.0003174792714133646, 0.00023810945356002347, 0.0001785820901700176,
				0.0001339365676275132, 0.0001004524257206349, 7.533931929047617e-5,
				5.650448946785713e-5, 4.237836710089285e-5, 3.1783775325669636e-5,
				2.3837831494252227e-5, 1.787837362068917e-5, 1.340878021551688e-5,
				1.005658516163766e-5, 7.542438871228245e-6, 5.656829153421184e-6,
				4.242621865065888e-6, 3.181966398799416e-6, 2.386474799099562e-6,
				1.789856099324672e-6, 1.342392074493504e-6, 1.006794055870128e-6,
			],
			mode: 'lines',
			name: 'N = 2',
		},
		{
			x: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
				20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
				38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
			],
			y: [
				1.0, 0.95, 0.9025, 0.8573749999999999, 0.8145062499999998,
				0.7737809374999998, 0.7350918906249997, 0.6983372960937497,
				0.6634204312890621, 0.630249409724608, 0.5987369392383777,
				0.5688000922764588, 0.5403600876626358, 0.513342083279504,
				0.48767497911552874, 0.46329123015975227, 0.44012666865176464,
				0.4181203352191764, 0.39721431845821757, 0.37735360253530666,
				0.3584859224085413, 0.34056162628811424, 0.3235335449737085,
				0.3073568677250231, 0.29198902433877195, 0.2773895731218333,
				0.2635190944657416, 0.2503391397424545, 0.2378121827553318,
				0.2259015736175652, 0.21457149493668692, 0.20378692019085256,
				0.1935135741813099, 0.1837178954722444, 0.17436600069863215,
				0.16542470066370052, 0.15686146563051548, 0.1486443923499897,
				0.1407421727324902, 0.1331240640958657, 0.12575986089107242,
				0.11861986784651879, 0.11167487445419284, 0.10489613073148319,
				0.09825532419490802, 0.09172455798516263, 0.0852763300859045,
				0.07888351358160928, 0.07251933790252882, 0.06615737100740238,
			],
			mode: 'lines',
			name: 'N = 10',
		},
		{
			x: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
				20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
				38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
			],
			y: [
				1.0, 0.99, 0.9801, 0.9702989999999999, 0.96059601, 0.9509900498999999,
				0.941480149401, 0.93206534790699, 0.9227446944279201,
				0.9135172474836409, 0.9043820750088045, 0.8953382542587165,
				0.8863848717161294, 0.8775210229989681, 0.8687458127689784,
				0.8600583546412886, 0.8514577710948757, 0.8429431933839269,
				0.8345137614500876, 0.8261686238355867, 0.8179069375972308,
				0.8097278682212585, 0.8016305895390459, 0.7936142836436554,
				0.7856781408072189, 0.7778213593991468, 0.7700431458051553,
				0.7623427143471037, 0.7547192872036326, 0.7471720943315962,
				0.7397003733882803, 0.7323033696543975, 0.7249803359578535,
				0.7177305325982759, 0.7105532272722931, 0.7034476959995702,
				0.6964132190395745, 0.6894490868491787, 0.682554595980686,
				0.6757290500208792, 0.6689717595206704, 0.6622820419254637,
				0.6556592215062091, 0.649102629291147, 0.6426116039982355,
				0.6361854879582532, 0.6298236330786706, 0.623525396747884,
				0.6172901427804052, 0.6111172413526012,
			],
			mode: 'lines',
			name: 'N = 50',
		},
		{
			x: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
				20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
				38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
			],
			y: [
				1.0, 0.995, 0.990025, 0.985074875, 0.980149500625, 0.975248753121875,
				0.9703725093562656, 0.9655206468094843, 0.9606930435754368,
				0.9558895783575596, 0.9511101304657718, 0.946354579813442,
				0.9416228069143748, 0.936914692879803, 0.932230119415404,
				0.9275689688183279, 0.9229311249742363, 0.9183164693493651,
				0.9137248860026183, 0.9091562615726052, 0.9046104832647421,
				0.9000874398484183, 0.8955870026491762, 0.8911090546359303,
				0.8866534803627507, 0.882220162960937, 0.8778089621461324,
				0.8734199173354017, 0.8690529187487247, 0.8647078441559811,
				0.8603846019352012, 0.8560831189255252, 0.8518033088308976,
				0.8475450932867431, 0.8433083928203094, 0.8390931508562078,
				0.8348992971029268, 0.8307267756174122, 0.8265755347393251,
				0.8224455280656285, 0.8183367184253003, 0.8142490348331737,
				0.8101823986590078, 0.8061367256657127, 0.8021119270373842,
				0.7981079094021973, 0.7941245748551863, 0.7901618209809104,
				0.7862195418760059, 0.7822976281666258,
			],
			mode: 'lines',
			name: 'N = 100',
		},
	]

	const layout = {
		title: 'Loss of Heterozygosity Due to Genetic Drift in Finite Populations',
		xaxis: { title: 'Generations' },
		yaxis: {
			title: 'Relative Heterozygosity (\\( H_t / H_0 \\))',
			range: [0, 1.05],
		},
		legend: { orientation: 'h', x: 0, y: -0.2 },
		margin: { t: 40 },
	}

	Plotly.newPlot('driftHeterozygosityPlot', traceData, layout)
}
