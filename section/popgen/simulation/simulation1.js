/* =======================================================
    SET 1: Discrete Nonoverlapping Generations Simulation
    -------------------------------------------------------
    Simulates population dynamics where individuals with different
    fitness values reproduce each generation without overlap.
    The average fitness determines population growth.
======================================================= */

function simulateDiscreteGenerations() {
    const initialPopulation = 100;
    const generations = 50;
  const fitnessValue = [1.2, 1.1, 0.9]; // Fitness de cada genótipo
  let genotypeCounts = [50, 30, 20];    // Contagem inicial dos genótipos

  const populations = [];   // Tamanho total da população por geração
  const genotypes = [];     // Distribuição dos genótipos por geração
  const fitness = [];       // Aptidão média por geração

    let currentPopulation = initialPopulation;
    let currentGenotypeCounts = [...genotypeCounts];

  // Função para calcular a aptidão média ponderada
function calculateAverageFitness(counts, fitnesses) {
    const totalFitness = counts.reduce((sum, n, i) => sum + n * fitnesses[i], 0);
    const totalGenotypes = counts.reduce((sum, n) => sum + n, 0);
    return totalGenotypes > 0 ? totalFitness / totalGenotypes : 0;
}

  // Simulação da evolução por geração
for (let t = 0; t < generations; t++) {
    const avgFitness = calculateAverageFitness(currentGenotypeCounts, fitnessValue);
    fitness.push(avgFitness);
    populations.push(currentPopulation);
    genotypes.push([...currentGenotypeCounts]);

    // Atualiza a população e os genótipos com base na aptidão
    currentPopulation = avgFitness * currentPopulation;
    currentGenotypeCounts = currentGenotypeCounts.map(n => Math.round(n * avgFitness));
}

  // === Plot 1: Crescimento Populacional ===
Plotly.newPlot("plot-population", [{
    x: [...Array(generations).keys()],
    y: populations,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Population'
}], {
    title: 'Population Growth',
    xaxis: { title: 'Generation' },
    yaxis: { title: 'Population Size' }
});

  // === Plot 2: Evolução dos Genótipos ===
const genotypeSeries = fitnessValue.map((_, i) => ({
    x: [...Array(generations).keys()],
    y: genotypes.map(g => g[i]),
    mode: 'lines+markers',
    name: `Genotype ${i + 1}`
}));

Plotly.newPlot("plot-genotypes", genotypeSeries, {
    title: 'Genotypes',
    xaxis: { title: 'Generation' },
    yaxis: { title: 'Genotype Count' }
});

  // === Plot 3: Aptidão Média ===
Plotly.newPlot("plot-fitness", [{
    x: [...Array(generations).keys()],
    y: fitness,
    mode: 'lines+markers',
    name: 'Fitness'
}], {
    title: 'Population Average Fitness',
    xaxis: { title: 'Generation' },
    yaxis: { title: 'Fitness' }
});
}

// Chamada da simulação ao carregar
simulateDiscreteGenerations();

/* =======================================================
    SET 2: Discrete vs Continuous Growth Models
    -------------------------------------------------------
    Compares discrete (geometric) and continuous (exponential) growth
    using a small initial population and various growth rates.
======================================================= */

function simulateGrowthComparison() {
    // === Parameters ===
    const N0_ = 10;              // Initial population size
    const s = 1;                 // Growth parameter
    const w = 1 + s;             // Discrete growth rate (geometric)
    const m2 = Math.log(2);      // Continuous rate for doubling in 1 year
    const m3 = s;                // Continuous growth equivalent to 100% per year
    const years = 4;             // Total simulation time (years)

    // === Time Arrays ===
    const te = [...Array(years + 1).keys()];                                // Discrete steps: [0, 1, 2, 3, 4]
    const t_c = Array.from({ length: 20 }, (_, i) => i * years / 19);       // 20 evenly spaced points for continuous models

    // === Population Calculations ===

    // Discrete growth: Nₜ = N₀ · wᵗ
    const N1 = te.map(t => N0_ * Math.pow(w, t));

    // Continuous growth models:
    const N2 = t_c.map(t => N0_ * Math.exp(m2 * t));  // m = ln(2)
    const N3 = t_c.map(t => N0_ * Math.exp(m3 * t));  // m = 1

    // === Y-axis customization ===
    const yTicks = Array.from({ length: 5 }, (_, i) => 2 * i * N0_);           // Y-axis tick values: [0, 20, 40, 60, 80]
    const yLabels = yTicks.map((_, i) => `${2 * i}N₀`);                        // Custom tick labels

    // === Trace Definitions for Plotly ===

    const traceDiscrete = {
        x: te,
        y: N1,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Discrete growth (w = 2)',
        line: { shape: 'hv' } // Step-wise pattern
    };

    const traceContM2 = {
        x: t_c,
        y: N2,
        type: 'scatter',
        mode: 'lines',
        name: 'Continuous growth (m = logₑ(2))'
    };

    const traceContM3 = {
        x: t_c,
        y: N3,
        type: 'scatter',
        mode: 'lines',
        name: 'Continuous growth (m = s = 1)'
    };

    // === Layout Configuration ===
    const layout = {
        title: 'Population Growth: Discrete vs Continuous',
        xaxis: {
            title: 'Time (t)',
            tickvals: te
        },
        yaxis: {
            title: 'Population Size (N)',
            tickvals: yTicks,
            ticktext: yLabels,
            range: [0, 8.5 * N0_]
        },
        legend: {
            font: { size: 10 }
        },
        margin: { t: 40 }
    };

    // === Plotly Rendering ===
    Plotly.newPlot('populationPlot', [traceDiscrete, traceContM2, traceContM3], layout);
}

// Run simulation
simulateGrowthComparison();


/* =======================================================
    SET 3: Exponential Decay Model
    -------------------------------------------------------
    Simulates population decline over time using a constant
    decay rate in an exponential decay equation.
======================================================= */

function simulateExponentialDecay() {
    const N0_decay = 100;       // Initial population
    const d_hat = 0.3;          // Decay rate
    const steps = 200;          // Number of time steps
    const tMax = 10;            // Total simulation time

    const t_decay = [];         // Time vector
    const N_decay = [];         // Population vector

    // Generate decay curve: N(t) = N0 * e^(-d * t)
    for (let i = 0; i <= steps; i++) {
        const time = i * tMax / steps;
        t_decay.push(time);
        N_decay.push(N0_decay * Math.exp(-d_hat * time));
    }

    // Plotting setup for Plotly
    const traceDecay = {
        x: t_decay,
        y: N_decay,
        mode: 'lines',
        name: `N(t) = ${N0_decay}e^(-${d_hat}t)`,
        line: { color: 'royalblue' }
    };

    const layout = {
        title: 'Exponential Population Decay',
        xaxis: { title: 'Time (t)' },
        yaxis: { title: 'Population Size N(t)' },
        showlegend: true
    };

    Plotly.newPlot('Decay', [traceDecay], layout);
}

// Run simulation
simulateExponentialDecay();



/* =======================================================
    SET 4: Continuous Selection with Fitness Variance
    -------------------------------------------------------
    Models the population size, average fitness, and fitness variance
    over generations assuming continuous selection and reproduction.
======================================================= */

function simulateContinuousSelection() {
    const generations = 50;          // Number of generations to simulate
    const types = 3;                 // Number of distinct genotypes
    const dt = 1.0;                  // Time interval between generations

    const genotypeCounts = [50, 30, 20];      // Initial counts per genotype
    const fitnessValues = [1.2, 1.1, 0.9];    // Relative fitness for each genotype

    // Data matrices initialization
    const n = Array.from({ length: generations }, () => Array(types).fill(0));
    const N = Array(generations).fill(0);             // Total population per generation
    const mean_m = Array(generations).fill(0);        // Mean fitness per generation
    const variance_m = Array(generations).fill(0);    // Fitness variance per generation

    // Generation 0 setup
    n[0] = [...genotypeCounts];
    N[0] = n[0].reduce((sum, ni) => sum + ni, 0);
    mean_m[0] = n[0].reduce((sum, ni, i) => sum + ni * fitnessValues[i], 0) / N[0];
    variance_m[0] = n[0].reduce((sum, ni, i) => sum + ni * Math.pow(fitnessValues[i], 2), 0) / N[0] - Math.pow(mean_m[0], 2);

    // Forward simulation through generations
    for (let t = 1; t < generations; t++) {
        for (let i = 0; i < types; i++) {
            n[t][i] = n[t - 1][i] * Math.exp(fitnessValues[i] * dt);
        }
        N[t] = n[t].reduce((sum, ni) => sum + ni, 0);
        mean_m[t] = n[t].reduce((sum, ni, i) => sum + ni * fitnessValues[i], 0) / N[t];
        variance_m[t] = n[t].reduce((sum, ni, i) => sum + ni * Math.pow(fitnessValues[i], 2), 0) / N[t] - Math.pow(mean_m[t], 2);
    }

    const time = [...Array(generations).keys()];

    // === Plot 1: Total Population (log scale) ===
    Plotly.newPlot('log-population', [{
        x: time,
        y: N,
        mode: 'lines+markers',
        name: 'Total population',
        line: { shape: 'linear' }
    }], {
        title: 'Total Population',
        yaxis: {
            title: 'log N(t)',
            type: 'log'
        },
        xaxis: { title: 'Time' }
    });

    // === Plot 2: Mean Fitness ===
    Plotly.newPlot('mean-fitness', [{
        x: time,
        y: mean_m,
        mode: 'lines+markers',
        name: 'Mean Fitness'
    }], {
        title: 'Population Average Fitness',
        yaxis: { title: '𝑚̄(t)' },
        xaxis: { title: 'Time' }
    });

    // === Plot 3: Fitness Variance ===
    Plotly.newPlot('fitness-variance', [{
        x: time,
        y: variance_m,
        mode: 'lines+markers',
        name: 'Fitness Variance'
    }], {
        title: 'Fitness Variance',
        yaxis: { title: 'Vₘ(t)' },
        xaxis: { title: 'Time' }
    });
}

// Run simulation
simulateContinuousSelection();


/* =======================================================
    SET 5: Age-Structured Population Dynamics
    -------------------------------------------------------
    Loads and visualizes age-structured population data from a JSON file.
    Generates a data table and plots for each age class,
    total population size, and growth rate.
======================================================= */

function simulateAgeStructuredPopulation() {
    fetch('../../../data/age_structured_population.json')
        .then(response => response.json())
        .then(populationTable => {
            // === Create Table ===
            const container = document.getElementById('population-table-container');
            const table = document.createElement('table');
            table.className = 'table table-striped table-bordered';
            table.style.fontSize = '0.9rem';

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr class="table-dark text-center">
                    <th>Time (t)</th>
                    <th>Age 0–1</th>
                    <th>Age 1–2</th>
                    <th>Age 2–3</th>
                    <th>Age 3–4</th>
                    <th>Age 4–5</th>
                    <th>Total N(t)</th>
                    <th>N(t)/N(t-1)</th>
                </tr>`;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            populationTable.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-center">${row.time}</td>
                    <td class="text-end">${row.age0}</td>
                    <td class="text-end">${row.age1}</td>
                    <td class="text-end">${row.age2}</td>
                    <td class="text-end">${row.age3}</td>
                    <td class="text-end">${row.age4}</td>
                    <td class="text-end fw-bold">${row.total}</td>
                    <td class="text-end">${row.ratio}</td>`;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            container.appendChild(table);

            // === Prepare data for plots ===
            const time = populationTable.map(row => row.time);
            const age0 = populationTable.map(row => row.age0);
            const age1 = populationTable.map(row => row.age1);
            const age2 = populationTable.map(row => row.age2);
            const age3 = populationTable.map(row => row.age3);
            const age4 = populationTable.map(row => row.age4);
            const totalN = populationTable.map(row => row.total);
            const growthRatio = populationTable.map(row => row.ratio === "–" ? null : parseFloat(row.ratio));

            const ageTraces = [
                { y: age0, name: "Age 0–1" },
                { y: age1, name: "Age 1–2" },
                { y: age2, name: "Age 2–3" },
                { y: age3, name: "Age 3–4" },
                { y: age4, name: "Age 4–5" }
            ].map(trace => ({
                x: time,
                y: trace.y,
                type: 'scatter',
                mode: 'lines+markers',
                name: trace.name
            }));

            Plotly.newPlot('plot-age-classes', ageTraces, {
                title: 'Population Growth by Age Classes',
                xaxis: { title: 'Time' },
                yaxis: { title: 'Population Size' },
                legend: { orientation: 'h' }
            });

            Plotly.newPlot('plot-total-population', [{
                x: time,
                y: totalN,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Total Population'
            }], {
                title: 'Total Population Growth',
                xaxis: { title: 'Time' },
                yaxis: { title: 'Nₜ' }
            });

            Plotly.newPlot('plot-growth-rate', [{
                x: time,
                y: growthRatio,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Nₜ / Nₜ₋₁'
            }], {
                title: 'Rate of Growth',
                xaxis: { title: 'Time' },
                yaxis: { title: 'Nₜ / Nₜ₋₁' }
            });
        })
        .catch(error => {
            console.error("Error loading age-structured population data:", error);
        });
}

// Run simulation
simulateAgeStructuredPopulation();


/* =======================================================
    SET 6: Survival and Fecundity Functions
    -------------------------------------------------------
    Generates curves of survival l(x) and birth rate b(x), then
    simulates exponential population growth using a fixed m estimate.
======================================================= */

function simulateSurvivalAndFecundity() {
    // === Curve generation ===
    const x = Array.from({ length: 1000 }, (_, i) => i * 0.1); // Age from 0 to 100
    const l = x.map(v => Math.exp(-0.05 * v));                 // Survival curve l(x)
    const b = x.map(v => (v > 15 && v < 50) ? Math.exp(-0.01 * Math.pow(v - 30, 2)) : 0); // Birth rate curve b(x)

    // === Exponential growth simulation ===
    const m_est = 0.0324;                                     // Estimated m value
    const t = Array.from({ length: 200 }, (_, i) => i * 0.5); // Time points for growth
    const N0 = 1e4;                                           // Initial population
    const Nt = t.map(v => N0 * Math.exp(m_est * v));          // N(t) = N0 * exp(m * t)

    // === Plot 1: Survival and birth rate functions ===
    const traceL = {
        x: x,
        y: l,
        name: 'Survival l(x)',
        mode: 'lines',
        line: { color: 'blue' }
    };

    const traceB = {
        x: x,
        y: b,
        name: 'Birth rate b(x)',
        mode: 'lines',
        line: { color: 'orange' }
    };

    Plotly.newPlot('plot-survival-birth', [traceL, traceB], {
        title: 'Survival and Birth Rate Functions',
        xaxis: { title: 'Age (x)' },
        yaxis: { title: 'Probability / Rate' },
        margin: { t: 50 }
    });

    // === Plot 2: Exponential population growth ===
    Plotly.newPlot('plot-exponential-growth', [{
        x: t,
        y: Nt,
        name: `Population N(t), m ≈ ${m_est.toFixed(4)}`,
        mode: 'lines',
        line: { color: 'green' }
    }], {
        title: 'Exponential Population Growth',
        xaxis: { title: 'Time (years)' },
        yaxis: { title: 'Population Size N(t)', type: 'log' },
        margin: { t: 50 }
    });
}

// Run simulation
simulateSurvivalAndFecundity();


/* =======================================================
    SET 7: Fisher's Reproductive Value
    -------------------------------------------------------
    Loads precomputed reproductive values from JSON and
    plots the reproductive value curve highlighting the maximum.
======================================================= */

function plotReproductiveValue() {
    fetch("../../../data/reproductive_value.json")
        .then(response => response.json())
        .then(data => {
            // Find the index of the maximum reproductive value
            const maxIndex = data.v_vals.indexOf(Math.max(...data.v_vals));

            // Plot the reproductive value curve and the maximum point
            Plotly.newPlot('plot-reproductive-value', [
                {
                    x: data.x_vals,
                    y: data.v_vals,
                    mode: 'lines',
                    name: `Reproductive Value v(x), m ≈ ${data.m.toFixed(4)}`,
                    line: { color: 'purple' }
                },
                {
                    x: [data.x_vals[maxIndex]],
                    y: [data.v_vals[maxIndex]],
                    mode: 'markers',
                    name: 'Maximum v(x)',
                    marker: { color: 'gray', size: 8, symbol: 'x' }
                }
            ], {
                title: "Fisher's Reproductive Value Curve",
                xaxis: { title: 'Age (x)' },
                yaxis: { title: 'Reproductive Value v(x)' }
            });
        })
        .catch(error => {
            console.error("Failed to load reproductive value data:", error);
        });
}

// Run plot
plotReproductiveValue();


/* =======================================================
    SET 8: Logistic vs Exponential Growth
    -------------------------------------------------------
    Simulates both regulated (logistic) and unregulated (exponential)
    population growth and compares them visually.
======================================================= */

function plotLogisticVsExponentialGrowth() {
    const rGrowth = 0.015;        // Intrinsic growth rate
    const kCapacity = 12000;      // Carrying capacity
    const n0Initial = 1000;       // Initial population size

    const timeRange = Array.from({ length: 1000 }, (_, i) => i * 200 / 999); // Time from 0 to 200

    const c0Logistic = (kCapacity - n0Initial) / n0Initial; // Constant for logistic growth

    const populationLogistic = timeRange.map(t =>
        kCapacity / (1 + c0Logistic * Math.exp(-rGrowth * t))
    );

    const populationExponential = timeRange.map(t =>
        n0Initial * Math.exp(rGrowth * t)
    );

    const lineCarryingCapacity = timeRange.map(() => kCapacity);

    const traceLogistic = {
        x: timeRange,
        y: populationLogistic,
        type: 'scatter',
        mode: 'lines',
        name: 'Logistic Growth (Regulated)',
        line: { color: 'green', width: 2 }
    };

    const traceExponential = {
        x: timeRange,
        y: populationExponential,
        type: 'scatter',
        mode: 'lines',
        name: 'Exponential Growth (Unregulated)',
        line: { color: 'blue', width: 2, dash: 'dash' }
    };

    const traceCapacity = {
        x: timeRange,
        y: lineCarryingCapacity,
        type: 'scatter',
        mode: 'lines',
        name: `Carrying Capacity (K = ${kCapacity})`,
        line: { color: 'gray', dash: 'dot' }
    };

    const layoutGrowthComparison = {
        title: 'Comparison of Logistic vs Exponential Population Growth',
        xaxis: { title: 'Time (years)' },
        yaxis: { title: 'Population Size' },
        margin: { t: 50 },
        legend: { orientation: 'h' }
    };

    Plotly.newPlot('plot-pop-growth', [traceLogistic, traceExponential, traceCapacity], layoutGrowthComparison);
}

// Run simulation
plotLogisticVsExponentialGrowth();


/* =======================================================
    SET 9: Two-Type Logistic Competition
    -------------------------------------------------------
    Models logistic competition between two strains with distinct
    growth rates, tracking population sizes, proportions, and logit.
======================================================= */

function simulateTwoTypeLogisticCompetition() {
    // Parameters
    const growthR1 = 0.5;
    const growthR2 = 0.3;
    const capacityK = 1000;
    const initN1 = 100;
    const initN2 = 100;
    const timeTotal = 100;
    const deltaT = 0.1;
    const stepsT = Math.floor(timeTotal / deltaT);

    const popN1 = Array(stepsT).fill(0);
    const popN2 = Array(stepsT).fill(0);
    const totalPop = Array(stepsT).fill(0);
    const propP1 = Array(stepsT).fill(0);
    const logitP1 = Array(stepsT).fill(0);
    const timeArr = Array.from({ length: stepsT }, (_, i) => i * deltaT);

    // Initial conditions
    popN1[0] = initN1;
    popN2[0] = initN2;
    totalPop[0] = initN1 + initN2;
    propP1[0] = initN1 / totalPop[0];
    logitP1[0] = Math.log(propP1[0] / (1 - propP1[0]));

    // Simulation loop
    for (let t = 1; t < stepsT; t++) {
        totalPop[t - 1] = popN1[t - 1] + popN2[t - 1];
        const rMean = (growthR1 * popN1[t - 1] + growthR2 * popN2[t - 1]) / totalPop[t - 1];

        const dn1 = popN1[t - 1] * (growthR1 - rMean * totalPop[t - 1] / capacityK) * deltaT;
        const dn2 = popN2[t - 1] * (growthR2 - rMean * totalPop[t - 1] / capacityK) * deltaT;

        popN1[t] = popN1[t - 1] + dn1;
        popN2[t] = popN2[t - 1] + dn2;
        totalPop[t] = popN1[t] + popN2[t];
        propP1[t] = popN1[t] / totalPop[t];
        logitP1[t] = Math.log(propP1[t] / (1 - propP1[t]));
    }

    // Plot 1: Population sizes
    const traceN1 = {
        x: timeArr,
        y: popN1,
        mode: 'lines',
        name: 'n₁ (strain 1)',
        line: { color: 'blue' }
    };

    const traceN2 = {
        x: timeArr,
        y: popN2,
        mode: 'lines',
        name: 'n₂ (strain 2)',
        line: { color: 'orange' }
    };

    const traceN = {
        x: timeArr,
        y: totalPop,
        mode: 'lines',
        name: 'Total N',
        line: { color: 'green', dash: 'dash' }
    };

    Plotly.newPlot('logistic-population', [traceN1, traceN2, traceN], {
        title: 'Population Dynamics under Logistic Regulation',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Population Size' },
        legend: { orientation: 'h' }
    });

    // Plot 2: Proportion and logit dynamics
    const traceP = {
        x: timeArr,
        y: propP1,
        mode: 'lines',
        name: 'p (n₁ / N)',
        line: { color: 'blue' }
    };

    const traceLogit = {
        x: timeArr,
        y: logitP1,
        mode: 'lines',
        name: 'log[p / (1 - p)]',
        line: { color: 'red', dash: 'dot' }
    };

    Plotly.newPlot('logistic-proportion', [traceP, traceLogit], {
        title: 'Proportion of Strain 1 and Logit Dynamics',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Proportion / Logit' },
        legend: { orientation: 'h' }
    });
}

simulateTwoTypeLogisticCompetition();


/* =======================================================
    SET 10: Two-Type Competition with Density Regulation
    -------------------------------------------------------
    Simulates frequency dynamics and total population growth of two types
    competing under density-dependent growth.
======================================================= */

function simulateTwoTypeDensityCompetition() {
    // Model parameters
    const wpc_r1 = 1.2;    // Growth rate of type 1
    const wpc_r2 = 1.0;    // Growth rate of type 2
    const wpc_c = 0.01;    // Density regulation constant
    const wpc_dt = 0.1;
    const wpc_t_max = 100;
    const wpc_steps = Math.floor(wpc_t_max / wpc_dt);

    // Arrays to store simulation results
    const wpc_time = [];
    const wpc_n1 = [];
    const wpc_n2 = [];
    const wpc_N = [];
    const wpc_p1 = [];

    // Initial conditions
    let wpc_curr_n1 = 10;
    let wpc_curr_n2 = 90;
    let wpc_curr_N = wpc_curr_n1 + wpc_curr_n2;
    let wpc_curr_p1 = wpc_curr_n1 / wpc_curr_N;

    // Simulation loop
    for (let i = 0; i < wpc_steps; i++) {
        const wpc_t = i * wpc_dt;
        wpc_time.push(wpc_t);
        wpc_n1.push(wpc_curr_n1);
        wpc_n2.push(wpc_curr_n2);
        wpc_N.push(wpc_curr_N);
        wpc_p1.push(wpc_curr_p1);

        // Mean growth rate weighted by population
        const wpc_rbar = (wpc_r1 * wpc_curr_n1 + wpc_r2 * wpc_curr_n2) / wpc_curr_N;

        // Density-regulated growth updates
        const wpc_dn1 = wpc_curr_n1 * (wpc_r1 - wpc_c * wpc_curr_N) * wpc_dt;
        const wpc_dn2 = wpc_curr_n2 * (wpc_r2 - wpc_c * wpc_curr_N) * wpc_dt;

        wpc_curr_n1 += wpc_dn1;
        wpc_curr_n2 += wpc_dn2;
        wpc_curr_N = wpc_curr_n1 + wpc_curr_n2;
        wpc_curr_p1 = wpc_curr_n1 / wpc_curr_N;
    }

    // Plot 1: Frequency of type 1
    Plotly.newPlot('wpc_plot_frequency', [{
        x: wpc_time,
        y: wpc_p1,
        mode: 'lines',
        name: 'Frequency of type 1 (p)',
        line: { color: 'blue' }
    }], {
        title: 'Frequency of Type 1 Over Time',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Frequency (p1)' }
    });

    // Plot 2: Total population size
    Plotly.newPlot('wpc_plot_total_population', [{
        x: wpc_time,
        y: wpc_N,
        mode: 'lines',
        name: 'Total Population (N)',
        line: { color: 'green' }
    }], {
        title: 'Total Population Size Over Time',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Population Size' }
    });
}

simulateTwoTypeDensityCompetition();


/* =======================================================
    SET 11: Competitive Growth from JSON Data
    -------------------------------------------------------
    Loads strain-specific growth data from a JSON file and
    plots population sizes and strain 1 frequency.
======================================================= */

function simulateCompetitiveGrowthFromJSON() {
    fetch('../../../data/competitive_growth.json')
        .then(response => response.json())
        .then(data => {
            const t = data.t;
            const n1 = data.n1;
            const n2 = data.n2;
            const N = data.N;
            const p1 = data.p1;

            // Plot 1: Population sizes
            Plotly.newPlot('comp-growth-population', [
                {
                    x: t,
                    y: n1,
                    name: 'Strain 1 (n1)',
                    mode: 'lines',
                    line: { color: 'blue' }
                },
                {
                    x: t,
                    y: n2,
                    name: 'Strain 2 (n2)',
                    mode: 'lines',
                    line: { color: 'orange' }
                },
                {
                    x: t,
                    y: N,
                    name: 'Total Population (N)',
                    mode: 'lines',
                    line: { color: 'green', dash: 'dash' }
                }
            ], {
                title: 'Population Dynamics',
                xaxis: { title: 'Time' },
                yaxis: { title: 'Population Size' }
            });

            // Plot 2: Proportion of strain 1
            Plotly.newPlot('comp-growth-proportion', [
                {
                    x: t,
                    y: p1,
                    name: 'Proportion of Strain 1 (p1)',
                    mode: 'lines',
                    line: { color: 'purple' }
                },
                {
                    x: [t[0], t[t.length - 1]],
                    y: [0.5, 0.5],
                    mode: 'lines',
                    name: 'p = 0.5',
                    line: { color: 'gray', dash: 'dot', width: 1 }
                }
            ], {
                title: 'Change in Proportion of Strain 1',
                xaxis: { title: 'Time' },
                yaxis: { title: 'Proportion', range: [0, 1] }
            });
        })
        .catch(error => {
            console.error("Error loading competitive growth JSON data:", error);
        });
}

simulateCompetitiveGrowthFromJSON();