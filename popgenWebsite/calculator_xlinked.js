        function calculateAlleleFrequency() {
            // Get observed values from input fields
            const A = parseFloat(document.getElementById('affected-males').value);
            const B = parseFloat(document.getElementById('normal-males').value);
            const C = parseFloat(document.getElementById('affected-females').value);
            const D = parseFloat(document.getElementById('normal-females').value);

            // Total population
            const N = A + B + C + D;

            // Compute allele frequency p using the closed-form formula
            const numerator = -B + Math.sqrt(Math.pow(B, 2) + 4 * (A + 2 * C) * (A + B + 2 * (C + D)));
            const denominator = 2 * (A + B + 2 * (C + D));
            const p = numerator / denominator;

            // Display the result
            document.getElementById('result').textContent = `Estimated allele frequency p for the X-linked trait: ${p.toFixed(4)}`;
        }