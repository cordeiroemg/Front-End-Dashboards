// Parameters
const p = 0.7;  // initial allele frequency for A
const P0 = 0.5;  // initial genotype frequency for AA
const C = 0.8;  // clonal reproduction rate
const S = 1 - C;  // sexual reproduction rate
const generations = 50;  // number of generations to simulate

// Arrays to store genotype frequencies
const P_t = new Array(generations).fill(0);
P_t[0] = P0;
const p_squared = Math.pow(p, 2);

// Simulate over generations
for (let t = 1; t < generations; t++) {
    P_t[t] = C * P_t[t - 1] + S * p_squared;
}

// Plotting
const trace1 = {
    x: Array.from({length: generations}, (v, k) => k),
    y: P_t,
    mode: 'lines',
    name: 'Genotype frequency of AA (P_t)'
};

const trace2 = {
    x: [0, generations - 1],
    y: [p_squared, p_squared],
    mode: 'lines',
    line: {color: 'red', dash: 'dash'},
    name: 'Expected Hardy-Weinberg (p²)'
};

const layout = {
    title: 'Convergence to Hardy-Weinberg Equilibrium under Mixed Reproduction',
    xaxis: {title: 'Generation'},
    yaxis: {title: 'Frequency of AA Genotype'},
    legend: {orientation: 'h'},
    margin: {t: 50, b: 50}
};

//Plotly.newPlot('plot1', [trace1, trace2], layout);

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    Plotly.newPlot('plot1', [trace1, trace2], layout);
});


// Initial allele frequencies
const p0_male = 0.1;     // initial frequency in males
const p0_female = 0.9;   // initial frequency in females

// Calculate the constant average frequency
const p_bar = (1 / 3) * p0_male + (2 / 3) * p0_female;

// Number of generations to simulate
const generations2 = 20;

// Arrays to store frequencies over generations
const male_freqs = [p0_male];
const female_freqs = [p0_female];
const mean_freqs = Array(generations2 + 1).fill(p_bar);

// Simulate generations
for (let t = 1; t <= generations2; t++) {
    // Male frequency in generation t is female frequency from t-1
    const p_male = female_freqs[t - 1];
    // Female frequency is average of previous male and female frequencies
    const p_female = 0.5 * (male_freqs[t - 1] + female_freqs[t - 1]);

    male_freqs.push(p_male);
    female_freqs.push(p_female);
}

// Plotting using Plotly.js
const traceMale2 = {
    x: Array.from({length: generations2 + 1}, (v, k) => k),
    y: male_freqs,
    mode: 'lines+markers',
    name: 'Male Allele Frequency (p*_t)',
    marker: {symbol: 'circle'}
};

const traceFemale2 = {
    x: Array.from({length: generations2 + 1}, (v, k) => k),
    y: female_freqs,
    mode: 'lines+markers',
    name: 'Female Allele Frequency (p**_t)',
    marker: {symbol: 'square'}
};

const traceMean2 = {
    x: [0, generations2],
    y: [p_bar, p_bar],
    mode: 'lines',
    line: {color: 'gray', dash: 'dash'},
    name: 'Mean Allele Frequency (p_bar)'
};

const layout2 = {
    title: 'Convergence of X-linked Allele Frequencies Over Generations',
    xaxis: {title: 'Generation'},
    yaxis: {title: 'Allele Frequency'},
    legend: {orientation: 'h'},
    margin: {t: 50, b: 50}
};

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    Plotly.newPlot('plot2', [traceMale2, traceFemale2, traceMean2], layout2);
});


// Initial LD: D0 = P0 - p_i * q_k
const D0 = 0.1;  // Initial departure from equilibrium

// Recombination rates
const c_values = [0.5, 0.2, 0.1];
const generations3 = Array.from({length: 9}, (v, k) => k);  // Array [0, 1, ..., 8]

// Compute D_t for each recombination rate
const ld_trajectories = {};

c_values.forEach(c => {
    const D_t = generations3.map(t => D0 * Math.pow(1 - c, t));
    ld_trajectories[c] = D_t;
});

// Plotting using Plotly.js
function plotLD() {
    const traces = c_values.map(c => ({
        x: generations3,
        y: ld_trajectories[c],
        mode: 'lines+markers',
        name: `c = ${c}`,
        marker: {symbol: 'circle'}
    }));

    const layout = {
        title: 'Decay of Linkage Disequilibrium Over Generations',
        xaxis: {title: 'Generation (t)'},
        yaxis: {title: 'Linkage Disequilibrium D_t'},
        shapes: [{
            type: 'line',
            x0: 0,
            x1: 8,
            y0: 0,
            y1: 0,
            line: {color: 'gray', dash: 'dash', width: 0.7}
        }],
        margin: {t: 50, b: 50}
    };

    Plotly.newPlot('plotLD', traces, layout);
}

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', plotLD);


// Define recombination values
const c_values3 = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5];

// Calculate median time to equilibrium: t = log(1/2) / log(1 - c)
const t_median = c_values3.map(c => Math.log(0.5) / Math.log(1 - c));

// Approximation for small c: t ≈ 0.693 / c
const t_approx = c_values3.map(c => 0.693 / c);

// Plotting using Plotly.js
function plotEquilibriumTimes() {
    const traceExact = {
        x: c_values3,
        y: t_median,
        mode: 'lines+markers',
        name: 'Exact Median Time',
        marker: {symbol: 'circle'}
    };

    const traceApprox = {
        x: c_values3,
        y: t_approx,
        mode: 'lines',
        name: 'Approximation (0.693 / c)',
        line: {color: 'gray', dash: 'dash'}
    };

    const layout = {
        title: 'Median Time to Reach Linkage Equilibrium vs Recombination Rate',
        xaxis: {title: 'Recombination Rate (c)', type: 'log'},
        yaxis: {title: 'Median Time to Equilibrium (Generations)', type: 'log'},
        margin: {t: 50, b: 50}
    };

    Plotly.newPlot('plotEquilibrium', [traceExact, traceApprox], layout);
}

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', plotEquilibriumTimes);

function calculateHomozygosity(p1) {
    const p2 = 1 - p1;
    const p_bar = (p1 + p2) / 2;
    const Vp = 0.25 * Math.pow(p1 - p2, 2);

    const homo_structured = Math.pow(p_bar, 2) + Vp;
    const homo_F1 = p1 * p2;
    const homo_F2 = Math.pow(p_bar, 2);

    return [homo_structured, homo_F1, homo_F2];
}

function updateHomozygosityPlot(p1) {
    document.getElementById('p1-value').textContent = p1;

    const values = calculateHomozygosity(parseFloat(p1));
    const labels = ['Structured (before mixing)', 'F1 Hybrids', 'F2 and Later'];

    const trace = {
        x: labels,
        y: values,
        type: 'bar',
        text: values.map(v => v.toFixed(3)),
        textposition: 'auto',
        marker: {color: ['steelblue', 'seagreen', 'darkorange']}
    };

    const layout = {
        title: 'Proportion of AA Homozygotes Across Population Types',
        yaxis: {title: 'Homozygosity (AA Frequency)', range: [0, 1]},
        margin: {t: 50, b: 50}
    };

    Plotly.newPlot('proportionAA', [trace], layout);
}

// Initial plot for Homozygosity
updateHomozygosityPlot(0.2);

function calculateFrequencies(p) {
    const q = 1 - p;
    const N_values = Array.from({length: 100}, (v, k) => (k + 1) * 10);
    const f_values = N_values.map(N => 1 / (2 * N - 1));

    const P_homo_finite = f_values.map(f => p**2 - p * q * f);
    const P_hetero_finite = f_values.map(f => 2 * p * q * (1 + f));

    const P_homo_HW = p**2;
    const P_hetero_HW = 2 * p * q;

    return {N_values, P_homo_finite, P_hetero_finite, P_homo_HW, P_hetero_HW};
}

function updateFinitePopulationPlot(p) {
    document.getElementById('p-value').textContent = p;

    const {N_values, P_homo_finite, P_hetero_finite, P_homo_HW, P_hetero_HW} = calculateFrequencies(parseFloat(p));

    const traceHomoFinite = {
        x: N_values,
        y: P_homo_finite,
        mode: 'lines',
        name: 'Finite Pop: Homozygote A_iA_i',
        line: {color: 'red'}
    };

    const traceHeteroFinite = {
        x: N_values,
        y: P_hetero_finite,
        mode: 'lines',
        name: 'Finite Pop: Heterozygote A_iA_j',
        line: {color: 'blue'}
    };

    const traceHomoHW = {
        x: [N_values[0], N_values[N_values.length - 1]],
        y: [P_homo_HW, P_homo_HW],
        mode: 'lines',
        name: 'HW Homozygote p^2',
        line: {color: 'red', dash: 'dash'}
    };

    const traceHeteroHW = {
        x: [N_values[0], N_values[N_values.length - 1]],
        y: [P_hetero_HW, P_hetero_HW],
        mode: 'lines',
        name: 'HW Heterozygote 2pq',
        line: {color: 'blue', dash: 'dash'}
    };

    const layout = {
        title: `Deviation from Hardy-Weinberg in Finite Populations (p = ${p})`,
        xaxis: {title: 'Population Size (N)'},
        yaxis: {title: 'Genotype Frequency', range: [0, 1]},
        margin: {t: 50, b: 50}
    };

    Plotly.newPlot('plotFinitePopulation', [traceHomoFinite, traceHeteroFinite, traceHomoHW, traceHeteroHW], layout);
}

// Initial plot for Finite Population
updateFinitePopulationPlot(0.05);