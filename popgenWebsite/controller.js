// Função para calcular a frequência alélica ligada ao X
function calculateAlleleFrequency() {
    const A = parseFloat(document.getElementById('affected-males').value);
    const B = parseFloat(document.getElementById('normal-males').value);
    const C = parseFloat(document.getElementById('affected-females').value);
    const D = parseFloat(document.getElementById('normal-females').value);

    if ([A, B, C, D].some(isNaN)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    const numerator = -B + Math.sqrt(B ** 2 + 4 * (A + 2 * C) * (A + B + 2 * (C + D)));
    const denominator = 2 * (A + B + 2 * (C + D));
    const p = denominator !== 0 ? numerator / denominator : NaN;

    document.getElementById('result').textContent = isNaN(p)
        ? "Invalid input or division by zero."
        : `Estimated allele frequency p: ${p.toFixed(4)}`;
}

// Inicialização de eventos após o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
    // Atribui evento ao botão de cálculo
    const calcBtn = document.getElementById('calc-button');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateAlleleFrequency);
    }

    // Inicializa gráficos interativos se funções estiverem disponíveis
    if (typeof simulateClonalConvergence === 'function') simulateClonalConvergence();
    if (typeof simulateXlinkedConvergence === 'function') simulateXlinkedConvergence();
    if (typeof plotLD === 'function') plotLD();
    if (typeof plotEquilibriumTimes === 'function') plotEquilibriumTimes();
    if (typeof updateHomozygosityPlot === 'function') updateHomozygosityPlot(0.2);
    if (typeof updateFinitePopulationPlot === 'function') updateFinitePopulationPlot(0.05);
});
