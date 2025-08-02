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
		title: 'Duration of Linkage to Introgressed Gene (Including r = 0.15)',
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
