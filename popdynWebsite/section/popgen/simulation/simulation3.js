/* =======================================================
    SET 1: Fibonacci-Based Decrease in Heterozygosity
    -------------------------------------------------------
    Models the loss of heterozygosity over generations due to
    full-sibling (brother-sister) mating. Uses Fibonacci numbers
    to simulate the reduction and visualizes the dynamics.
======================================================= */

function simulateFibonacciHeterozygosity() {
    const generations = 10;

    // Initialize Heterozygosity array
    const H_t = new Array(generations + 1).fill(0);
    H_t[0] = 1.0; // Initial heterozygosity H_0

    // Generate Fibonacci sequence
    const fib = [1, 2];
    for (let i = 2; i <= generations; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
    }

    // Compute H_t using Fibonacci/2^t
    for (let t = 1; t <= generations; t++) {
        H_t[t] = fib[t] / Math.pow(2, t);
    }

    // Compute relative heterozygosity (P), decrease (f), and rates
    const P = H_t.map(ht => ht / H_t[0]);
    const f = P.map(p => 1 - p);
    const rate_change = H_t.slice(1).map((ht, i) => ht / H_t[i]);
    const delta_rate = rate_change.map(rc => 1 - rc);

    // Plot relative heterozygosity P
    Plotly.newPlot('plotRelativeHeterozygosity', [{
        x: Array.from({ length: generations + 1 }, (_, k) => k),
        y: P,
        mode: 'lines+markers',
        name: 'Relative Heterozygosity (P)'
    }], {
        title: 'Relative Heterozygosity (P)',
        xaxis: { title: 'Generation' },
        yaxis: { title: 'Relative Heterozygosity (P)' },
        margin: { t: 50, b: 50 }
    });

    // Plot decrease in heterozygosity f
    Plotly.newPlot('plotDecreaseHeterozygosity', [{
        x: Array.from({ length: generations + 1 }, (_, k) => k),
        y: f,
        mode: 'lines+markers',
        name: 'Decrease in Heterozygosity (f)'
    }], {
        title: 'Decrease in Heterozygosity (f)',
        xaxis: { title: 'Generation' },
        yaxis: { title: 'Decrease in Heterozygosity (f)' },
        margin: { t: 50, b: 50 }
    });

    // Plot rate of change H_t / H_{t-1}
    Plotly.newPlot('plotRateOfChange', [{
        x: Array.from({ length: generations + 1 }, (_, k) => k),
        y: [null, ...rate_change],
        mode: 'lines+markers',
        name: 'Rate of Change (H_t / H_{t-1})'
    }], {
        title: 'Rate of Change (H_t / H_{t-1})',
        xaxis: { title: 'Generation' },
        yaxis: { title: 'Rate of Change (H_t / H_{t-1})' },
        margin: { t: 50, b: 50 }
    });

    // Plot delta rate: 1 - rate
    Plotly.newPlot('plotDeltaRate', [{
        x: Array.from({ length: generations + 1 }, (_, k) => k),
        y: [null, ...delta_rate],
        mode: 'lines+markers',
        name: 'Delta Rate (1 - H_t / H_{t-1})'
    }], {
        title: 'Delta Rate (1 - H_t / H_{t-1})',
        xaxis: { title: 'Generation' },
        yaxis: { title: 'Delta Rate (1 - H_t / H_{t-1})' },
        margin: { t: 50, b: 50 }
    });
}

simulateFibonacciHeterozygosity();


/* =======================================================
    SET 2: Genotype Frequencies and Inbreeding Coefficient
    -------------------------------------------------------
    Simulates genotype frequencies and heterozygosity as a function
    of the inbreeding coefficient f. Also calculates the correlation
    coefficient r between gametes to compare with f.
======================================================= */

function simulateInbreedingGenotypes() {
    const p1 = 0.6;
    const p2 = 1 - p1;
    const f_values = Array.from({ length: 100 }, (_, k) => k / 100);

    // Genotype frequencies under inbreeding
    const AA = f_values.map(f => p1 ** 2 * (1 - f) + p1 * f);
    const Aa = f_values.map(f => 2 * p1 * p2 * (1 - f));
    const aa = f_values.map(f => p2 ** 2 * (1 - f) + p2 * f);

    // Heterozygosity H_f = H0 * (1 - f)
    const H0 = 2 * p1 * p2;
    const H_f = f_values.map(f => H0 * (1 - f));

    // Plot genotype frequencies
    Plotly.newPlot('plotGenotypeFrequencies', [
        { x: f_values, y: AA, mode: 'lines', name: 'A1A1', line: { color: 'blue' } },
        { x: f_values, y: Aa, mode: 'lines', name: 'A1A2', line: { color: 'green' } },
        { x: f_values, y: aa, mode: 'lines', name: 'A2A2', line: { color: 'red' } }
    ], {
        title: 'Genotype Frequencies vs Inbreeding Coefficient (f)',
        xaxis: { title: 'Inbreeding Coefficient (f)' },
        yaxis: { title: 'Genotype Frequency' },
        margin: { t: 50, b: 50 }
    });

    // Plot heterozygosity
    Plotly.newPlot('plotHeterozygosity', [
        { x: f_values, y: H_f, mode: 'lines', name: 'Heterozygosity (Hf)', line: { color: 'purple' } },
        { x: [f_values[0], f_values[f_values.length - 1]], y: [H0, H0], mode: 'lines', name: 'H0 (Random Mating)', line: { color: 'gray', dash: 'dash' } }
    ], {
        title: 'Expected Heterozygosity vs Inbreeding Coefficient (f)',
        xaxis: { title: 'Inbreeding Coefficient (f)' },
        yaxis: { title: 'Heterozygosity' },
        margin: { t: 50, b: 50 }
    });
}

function simulateGameteCorrelation() {
    const p1 = 0.7;
    const p2 = 1 - p1;
    const f_values = Array.from({ length: 100 }, (_, k) => k / 100);
    const r_values = [];

    f_values.forEach(f => {
        const freq_A1A1 = p1 ** 2 * (1 - f) + p1 * f;
        const freq_A1A2 = p1 * p2 * (1 - f);
        const freq_A2A1 = p2 * p1 * (1 - f);
        const freq_A2A2 = p2 ** 2 * (1 - f) + p2 * f;

        const data = [
            [0, 0, freq_A2A2],
            [1, 0, freq_A1A2],
            [0, 1, freq_A2A1],
            [1, 1, freq_A1A1]
        ];

        const X = data.map(d => d[0]);
        const Y = data.map(d => d[1]);
        const freq = data.map(d => d[2]);

        const EX = X.reduce((sum, xi, i) => sum + xi * freq[i], 0);
        const EY = Y.reduce((sum, yi, i) => sum + yi * freq[i], 0);
        const EXY = X.reduce((sum, xi, i) => sum + xi * Y[i] * freq[i], 0);
        const EX2 = X.reduce((sum, xi, i) => sum + xi ** 2 * freq[i], 0);
        const EY2 = Y.reduce((sum, yi, i) => sum + yi ** 2 * freq[i], 0);

        const var_X = EX2 - EX ** 2;
        const var_Y = EY2 - EY ** 2;
        const cov_XY = EXY - EX * EY;

        const r = var_X * var_Y > 0 ? cov_XY / Math.sqrt(var_X * var_Y) : 0;
        r_values.push(r);
    });

    Plotly.newPlot('plotCorrelation', [
        { x: f_values, y: r_values, mode: 'lines', name: 'Computed r', line: { color: 'blue' } },
        { x: f_values, y: f_values, mode: 'lines', name: 'r = f (Identity)', line: { color: 'black', dash: 'dash' } }
    ], {
        title: 'Inbreeding Coefficient (f) vs Gamete Correlation (r)',
        xaxis: { title: 'Inbreeding Coefficient (f)' },
        yaxis: { title: 'Correlation Coefficient (r)' },
        margin: { t: 50, b: 50 }
    });
}

simulateInbreedingGenotypes();
simulateGameteCorrelation();
