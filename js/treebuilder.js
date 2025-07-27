// pedigree_tree.js

function buildTree(pedigree, nodeId) {
	const node = { name: nodeId, children: [] }
	const parents = pedigree[nodeId].parents
	if (parents) {
		node.children = parents.map((p) => buildTree(pedigree, p))
	}
	return node
}

function drawTree(pedigree) {
	const svg = d3.select('#tree')
	svg.selectAll('*').remove() // clear previous tree

	const width = +svg.attr('width')
	const height = +svg.attr('height')

	const rootId = Object.keys(pedigree).slice(-1)[0] // use last individual as root
	const rootData = buildTree(pedigree, rootId)
	const root = d3.hierarchy(rootData)
	const treeLayout = d3.tree().size([width - 100, height - 100])
	treeLayout(root)

	svg
		.selectAll('line.link')
		.data(root.links())
		.join('line')
		.attr('class', 'link')
		.attr('stroke', '#999')
		.attr('stroke-width', 2)
		.attr('x1', (d) => d.source.x + 50)
		.attr('y1', (d) => d.source.y + 50)
		.attr('x2', (d) => d.target.x + 50)
		.attr('y2', (d) => d.target.y + 50)

	const node = svg
		.selectAll('g.node')
		.data(root.descendants())
		.join('g')
		.attr('class', 'node')
		.attr('transform', (d) => `translate(${d.x + 50},${d.y + 50})`)

	node.append('circle').attr('r', 20).attr('fill', '#69b3a2')
	node
		.append('text')
		.attr('dy', 5)
		.attr('text-anchor', 'middle')
		.text((d) => d.data.name)
}

function runSimulation() {
	const inputText = document.getElementById('pedigreeInput').value
	const numLoci = parseInt(document.getElementById('numLoci').value)
	let pedigree

	try {
		pedigree = JSON.parse(inputText)
	} catch (e) {
		alert('Erro no JSON do pedigree!')
		return
	}

	const { fValues, fIJ, rIJ } = simulateIBD(pedigree, numLoci)

	const outputLines = []

	// Cabeçalho
	outputLines.push(
		`ID`.padEnd(10) + 'f_I'.padEnd(12) + 'f_IJ'.padEnd(12) + 'r_IJ'
	)

	// Obter todos os IDs únicos
	const allIds = new Set([
		...Object.keys(fValues),
		...Object.keys(fIJ),
		...Object.keys(rIJ),
	])

	// Adicionar linhas formatadas
	for (const id of allIds) {
		const fi = fValues[id]?.toFixed(3) ?? '-'
		const fij = fIJ[id]?.toFixed(3) ?? '-'
		const rij = rIJ[id]?.toFixed(3) ?? '-'

		outputLines.push(id.padEnd(10) + fi.padEnd(12) + fij.padEnd(12) + rij)
	}

	document.getElementById('outputText').textContent = outputLines.join('\n')

	// Plot heatmap using Plotly
	const ids = Object.keys(fValues)
	const matrix = ids.map((i) =>
		ids.map((j) => {
			const key = i < j ? `${i},${j}` : `${j},${i}`
			return i === j ? 1 : rIJ[key] ?? 0
		})
	)

	const heatmapData = {
		z: matrix,
		x: ids,
		y: ids,
		type: 'heatmap',
		colorscale: 'YlGnBu',
		zmin: 0,
		zmax: 1,
	}

	Plotly.newPlot('plotContainer', [heatmapData], {
		title: 'Coeficiente de Relacionamento (rᵢⱼ)',
		xaxis: { title: 'Indivíduo J' },
		yaxis: { title: 'Indivíduo I' },
	})

	drawTree(pedigree) // update tree with same pedigree
}
