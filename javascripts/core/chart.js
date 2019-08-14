"use strict";

Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = 'Typewriter';
let dimChartEl = document.createElement("canvas");
dimChartEl.setAttribute("width", "1500");
dimChartEl.setAttribute("height", "500");
dimChartEl.setAttribute("style", "user-select: none;");
const normalDimChart = new Chart(dimChartEl.getContext("2d"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: ['Exponents of antimatter per second'],
            data: [],
            backgroundColor: [
                'rgba(0,0,0,1)'
            ],
            borderColor: [
                'rgba(0,0,0,1)'
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
        tooltips: {enabled: false},
        hover: {mode: null},
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
    var points = Math.ceil(player.options.chart.duration / player.options.chart.updateRate * 1000 - 1);
    if (chart.data.datasets[0].data.length > points) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    data = Math.max(data.log(10), 0.1);
    comp1 = Array.max(chart.data.datasets[0].data);
    comp2 = Array.min(chart.data.datasets[0].data);
    if (data > comp1) {
        chart.options.scales.yAxes[0].ticks.max = data;
    }
    if (chart.options.scales.yAxes[0].ticks.min < comp2 || chart.options.scales.yAxes[0].ticks.min == Infinity) {
        chart.options.scales.yAxes[0].ticks.min = comp2;
    }
    if (data < chart.options.scales.yAxes[0].ticks.min && player.options.chart.dips) {
        chart.options.scales.yAxes[0].ticks.min = data;
    }
    var preservedChartValues = false;
    let failSafe = 0;
    while (chart.data.datasets[0].data.length < points) {
        if (preservedChartValues) {
            chart.data.labels.push(undefined);
            chart.data.datasets.forEach( function(dataset) {
                dataset.data.push(data);
            });
        } else {
            var temp = chart.data.datasets[0].data.slice();
            var tempData = data;
            preservedChartValues = true;
        }
        if (chart.data.datasets[0].data.length >= points) {
            var temp2 = chart.data.datasets[0].data.slice();
          for (let i = 0; i < temp.length; i++) {
                temp2[chart.data.datasets[0].data.length - temp.length + i] = temp[i];
                temp2[i] = data;
            }
            chart.data.datasets[0].data = temp2;
        }
    }
    while (chart.data.datasets[0].data.length > points && failSafe < 1000) {
        chart.data.labels.pop();
        chart.data.datasets.forEach( function(dataset) {
            dataset.data.pop(data);
        });
        failSafe++;
    }
    chart.data.labels.push(undefined);
    chart.data.datasets.forEach( function(dataset) {
        if (data < chart.data.datasets[0].data[chart.data.datasets[0].data.length-1] && !player.options.chart.dips) dataset.data.push(chart.data.datasets[0].data[chart.data.datasets[0].data.length-1]);
        else dataset.data.push(data);
    });
    chart.update(100);
}