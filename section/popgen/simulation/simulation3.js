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
