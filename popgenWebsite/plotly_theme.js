// plotly_theme.js

function getDefaultLayout(title = '') {
    return {
        title: { text: title, font: { size: 20, color: '#333' } },
        font: { family: 'Inter, sans-serif', color: '#333', size: 14 },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#f5f5f5',
        xaxis: {
            title: 'X Axis',
            gridcolor: '#eeeeee',
            zeroline: false,
            linecolor: '#ccc',
            tickfont: { color: '#555' },
            titlefont: { size: 14 }
        },
        yaxis: {
            title: 'Y Axis',
            gridcolor: '#eeeeee',
            zeroline: false,
            linecolor: '#ccc',
            tickfont: { color: '#555' },
            titlefont: { size: 14 }
        },
        legend: {
            orientation: 'h',
            xanchor: 'center',
            x: 0.5,
            y: -0.2,
            font: { size: 12 }
        },
        margin: { l: 50, r: 30, t: 50, b: 60 }
    };
}