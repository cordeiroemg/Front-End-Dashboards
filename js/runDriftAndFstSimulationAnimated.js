const driftSim = {
	alleleFreqs: [],
	fSt: [],
	gen: 0,
	numGenerations: 100,
	numSubpops: 10,
	Ne: 50,
	intervalId: null,
	running: false,
	tracesAllele: [],
	traceFst: null,
}

function binomialSample(n, p) {
	let count = 0
	for (let i = 0; i < n; i++) {
		if (Math.random() < p) count++
	}
	return count
}

function setupDriftSimData() {
	const { numGenerations, numSubpops, Ne } = driftSim
	const initialP = 0.5

	driftSim.alleleFreqs = Array.from({ length: numGenerations }, () =>
		Array(numSubpops).fill(0)
	)
	driftSim.alleleFreqs[0] = Array(numSubpops).fill(initialP)

	for (let gen = 1; gen < numGenerations; gen++) {
		for (let pop = 0; pop < numSubpops; pop++) {
			const p = driftSim.alleleFreqs[gen - 1][pop]
			const countA = binomialSample(2 * Ne, p)
			driftSim.alleleFreqs[gen][pop] = countA / (2 * Ne)
		}
	}

	const meanFreqs = driftSim.alleleFreqs.map(
		(gen) => gen.reduce((a, b) => a + b, 0) / numSubpops
	)
	const varFreqs = driftSim.alleleFreqs.map((gen, i) => {
		const mean = meanFreqs[i]
		const sqDiff = gen.map((p) => (p - mean) ** 2)
		return sqDiff.reduce((a, b) => a + b, 0) / numSubpops
	})
	driftSim.fSt = meanFreqs.map((mean, i) =>
		mean * (1 - mean) !== 0 ? varFreqs[i] / (mean * (1 - mean)) : 0
	)

	driftSim.gen = 0
	driftSim.running = false

	driftSim.tracesAllele = []
	for (let i = 0; i < numSubpops; i++) {
		driftSim.tracesAllele.push({
			x: [],
			y: [],
			mode: 'lines',
			name: `Pop ${i + 1}`,
			line: { width: 1 },
		})
	}

	driftSim.traceFst = {
		x: [],
		y: [],
		mode: 'lines',
		name: 'FST',
		line: { width: 2, color: 'black' },
	}

	Plotly.newPlot('alleleFreqChart', driftSim.tracesAllele, {
		title: 'Allele Frequency Drift',
		xaxis: { title: 'Generation' },
		yaxis: { title: 'Allele Frequency', range: [0, 1] },
		margin: { t: 40 },
	})

	Plotly.newPlot('fstChart', [driftSim.traceFst], {
		title: 'FST Over Time',
		xaxis: { title: 'Generation' },
		yaxis: { title: 'FST', range: [0, 1] },
		margin: { t: 40 },
	})
}

function startDriftAnimation() {
	if (driftSim.running) return
	driftSim.running = true

	driftSim.intervalId = setInterval(() => {
		const gen = driftSim.gen
		if (gen >= driftSim.numGenerations) {
			pauseDriftAnimation()
			return
		}

		driftSim.tracesAllele.forEach((trace, i) => {
			trace.x.push(gen)
			trace.y.push(driftSim.alleleFreqs[gen][i])
		})

		driftSim.traceFst.x.push(gen)
		driftSim.traceFst.y.push(driftSim.fSt[gen])

		Plotly.react('alleleFreqChart', driftSim.tracesAllele)
		Plotly.react('fstChart', [driftSim.traceFst])

		driftSim.gen++
	}, 200)
}

function pauseDriftAnimation() {
	if (driftSim.intervalId) {
		clearInterval(driftSim.intervalId)
		driftSim.intervalId = null
		driftSim.running = false
	}
}

function resetDriftAnimation() {
	pauseDriftAnimation()
	setupDriftSimData()
}
