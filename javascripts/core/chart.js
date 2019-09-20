"use strict";

Chart.defaults.global.defaultFontColor = "black";
Chart.defaults.global.defaultFontFamily = "Typewriter";
const dimChartEl = document.createElement("canvas");
dimChartEl.setAttribute("width", "1500");
dimChartEl.setAttribute("height", "500");
dimChartEl.setAttribute("style", "user-select: none;");
const normalDimChart = new Chart(dimChartEl.getContext("2d"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: ["Exponents of antimatter per second"],
            data: [],
            backgroundColor: [
                "rgba(0,0,0,1)"
            ],
            borderColor: [
                "rgba(0,0,0,1)"
            ],
            fill: false,
            lineTension: 0.1,
            borderWidth: 3,
            pointRadius: 0,
            pointBorderWidth: 0,
            pointHoverRadius: 0
        }]
    },
    options: {
        tooltips: { enabled: false },
        hover: { mode: null },
        legend: {
            display: false,
            labels: {
                boxWidth: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: 100000000,
                    min: 1
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                    drawTicks: false
                },
                ticks: {
                    fontSize: 0
                }
            }]
        },
        layout: {
            padding: {
            top: 10
            }
        }
    }
});

function addChartData(data) {
    const chart = normalDimChart;
    const points = Math.ceil(player.options.chart.duration / player.options.chart.updateRate * 1000 - 1);
    if (chart.data.datasets[0].data.length > points) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    const chartData = Math.max(data.log(10), 0.1);
    const comp1 = Array.max(chart.data.datasets[0].data);
    const comp2 = Array.min(chart.data.datasets[0].data);
    if (chartData > comp1) {
        chart.options.scales.yAxes[0].ticks.max = chartData;
    }
    if (chart.options.scales.yAxes[0].ticks.min < comp2 || chart.options.scales.yAxes[0].ticks.min === Infinity) {
        chart.options.scales.yAxes[0].ticks.min = comp2;
    }
    if (chartData < chart.options.scales.yAxes[0].ticks.min && player.options.chart.dips) {
        chart.options.scales.yAxes[0].ticks.min = chartData;
    }
    let preservedChartValues = false;
    let failSafe = 0;
    let temp1;
    let temp2;
    while (chart.data.datasets[0].data.length < points) {
        if (preservedChartValues) {
            chart.data.labels.push(undefined);
            chart.data.datasets.forEach(dataset => {
                dataset.data.push(chartData);
            });
        } else {
            temp1 = chart.data.datasets[0].data.slice();
            preservedChartValues = true;
        }
        if (chart.data.datasets[0].data.length >= points) {
            temp2 = chart.data.datasets[0].data.slice();
          for (let i = 0; i < temp1.length; i++) {
                temp2[chart.data.datasets[0].data.length - temp1.length + i] = temp1[i];
                temp2[i] = chartData;
            }
            chart.data.datasets[0].data = temp2;
        }
    }
    while (chart.data.datasets[0].data.length > points && failSafe < 1000) {
        chart.data.labels.pop();
        chart.data.datasets.forEach(dataset => {
            dataset.data.pop(chartData);
        });
        failSafe++;
    }
    chart.data.labels.push(undefined);
    chart.data.datasets.forEach(dataset => {
        if (chartData < chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] &&
            !player.options.chart.dips) {
            dataset.data.push(chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1]);
        } else dataset.data.push(chartData);
    });
    chart.update(100);
}