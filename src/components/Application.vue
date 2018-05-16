<template>
    <div v-if="isLoading">
        <b-alert show variant="primary">
            Loading...
        </b-alert>
    </div>
    <div v-else-if="isError">
        <b-alert show variant="danger">
            <b v-if="queryErr.cod">Error: {{queryErr.cod}}</b>
            {{queryErr.message}}
        </b-alert>
    </div>
    <div v-else-if="isSuccess">
        <b-card border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                footer-bg-variant="primary"
                footer-text-variant="white"

                header-tag="header"
                footer-tag="footer"
        >
            <!--<h6 slot="header" class="mb-0">Monday, 6 Febuary</h6>-->
            <h6 slot="header" class="mb-0">
                {{currentDate.dayName}},
                {{currentDate.date}} {{currentDate.month}}
                <small>(weather at {{currentDate.time}})</small>
            </h6>
            <b-card-body>
                <div class="card-text text-center">
                    <h3>
                        <a :href="`https://www.google.com.ua/maps/@${cityForecast.coord.lat},${cityForecast.coord.lon},10z`"
                           target="_blank"
                        >
                            {{cityForecast.name}}, {{cityForecast.country}}
                        </a>
                    </h3>
                    <h2>{{fixedToDec(currentForecast.main.temp, 1)}}°C</h2>
                    <h5 class="text-uppercase">
                        <img :src="`http://openweathermap.org/img/w/${currentForecast.weather[0].icon}.png`"/>
                        {{currentForecast.weather[0].description}}
                    </h5>
                </div>
            </b-card-body>
            <div slot="footer">
                <b-row>
                    <b-col>
                        <span>Pressure:</span>
                        <b>{{fixedToDec(currentForecast.main.pressure, 1)}} hPa</b>
                    </b-col>
                    <b-col>
                        <span>Humidity:</span>
                        <b>{{fixedToDec(currentForecast.main.humidity)}}%</b>
                    </b-col>
                    <b-col>
                        <span>Wind Speed:</span>
                        <b>{{fixedToDec(currentForecast.wind.speed, 1)}} m/s</b>
                    </b-col>
                    <b-col>
                        <span>Clouds:</span>
                        <b>{{fixedToDec(currentForecast.clouds.all)}}%</b>
                    </b-col>
                </b-row>
            </div>
        </b-card>
        <br/>
        <h5 class="text-primary">Forecast 16 days</h5>
        <b-card no-body border-variant="primary">
            <b-tabs card>
                <b-tab title="Wind">
                    <vue-chart type="horizontalBar" :options="chartOptionsWind" :data="chartDataWind"/>
                </b-tab>
                <b-tab title="Temperature" active>
                    <vue-chart type="bar" :options="chartOptionsTemperature" :data="chartDataTemperature"/>
                </b-tab>
                <b-tab title="Pressure">
                    <vue-chart type="bar" :options="chartOptionsPressure" :data="chartDataPressure"/>
                </b-tab>
                <b-tab title="Humidity">
                    <vue-chart type="line" :options="chartOptionsHumidity" :data="chartDataHumidity"/>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import VueChart from 'vue-chart-js'
import forecastAPI from '../api/forecast'
import configs from '@/configs'
import utils from '@/utils'

export default {
    name: 'Application',
    data () {
        return {
            queryCity: '',
            queryErr: null,

            isLoading: true,
            isError: false,
            isSuccess: false,

            currentDate: {
                dayName: '',
                date: 0,
                month: 0,
                time: 0
            },
            cityForecast: {},
            listForecast: [],

            chartDataWind: {
                labels: utils.createEmptyArray(configs.diagramsDot * configs.countDotInDay),
                datasets: []
            },
            chartOptionsWind: {
                responsive: true,
                title: {
                    display: true,
                    position: 'right'
                },

                tooltips: {
                    intersect: false,
                    displayColors: false,
                    callbacks: {
                        label(tooltipItem, data) {
                            let item = data.datasets[tooltipItem.datasetIndex];

                            return `${item.time} - `
                                    + `${item.dataDeg[tooltipItem.index]}° - `
                                    + `${item.data[tooltipItem.index]} m/s`;
                        }
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Speed (m/s)'
                        },
                        ticks: {
                            min: 0
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        },
                    }]
                }
            },
            chartDataTemperature: {
                labels: utils.createEmptyArray(configs.diagramsDot),
                datasets: []
            },
            chartOptionsTemperature: {
                responsive: true,
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        title(tooltipItems, data){
                            return `${tooltipItems[0].xLabel} ${data.datasets[tooltipItems[0].datasetIndex].time}`;
                        },
                        label(tooltipItem, data) {
                            return `${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}°C`;
                        }
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: 0,
                            min: -20,
                            max: 30
                        }
                    }]
                }
            },
            chartDataPressure: {
                labels: utils.createEmptyArray(configs.diagramsDot * configs.countDotInDay),
                datasets: [
                    {
                        yAxisID: 'y-axis-1',
                        data: []
                    }
                ]
            },
            chartOptionsPressure: {
                responsive: true,
                tooltips: {
                    displayColors: false,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title(tooltipItems, data){
                            return `${tooltipItems[0].xLabel}`;
                        },
                        label(tooltipItem, data) {
                            return `${+data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + configs.normalPressure} hPa`;
                        }
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }],
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'right',
                            scaleLabel: {
                                display: true,
                                labelString: 'Delta Pressure (hPa)'
                            },
                            ticks: {
                                beginAtZero: true,
                                min: -configs.deltaPressure,
                                max: configs.deltaPressure
                            },
                            gridLines: {
                                zeroLineColor: 'rgba(0, 123, 255, .5)'
                            }
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                labelString: 'Pressure (hPa)'
                            },
                            ticks: {
                                min: Math.floor(configs.normalPressure - configs.deltaPressure),
                                max: Math.floor(configs.normalPressure + configs.deltaPressure),
                                stepSize: 5
                            }
                        }
                    ]
                }
            },
            chartDataHumidity: {
                labels: utils.createEmptyArray(configs.diagramsDot * configs.countDotInDay),
                datasets: [{
                    backgroundColor: 'red',
                    borderColor: 'red',
                    fill: false,
                    data: []
                }]
            },
            chartOptionsHumidity: {
                responsive: true,
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        title(tooltipItems, data){
                            return `${tooltipItems[0].xLabel}`;
                        },
                        label(tooltipItem, data) {
                            return `${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}%`;
                        }
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Percents (%)'
                        },
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }]
                }
            }
        }
    },
    components: {
        VueChart
    },
    computed: {
        currentForecast(){
            return this.listForecast.length
                    ? this.listForecast[0]
                    : null;
        }
    },
    created () {
        this.fetchData();
    },
    watch: {
        'currentForecast': 'updateCurrentDate',
        'listForecast': 'chartDataset',
        '$route': 'fetchData'
    },
    methods: {
        createStackTemperature(stackId, data){
            return {
                stack: `Stack ${stackId}`,
                time: stackId.split(':').splice(0, 2).join(':'),
                data: data,
                borderWidth: 4,
                borderColor: 'rgba(0, 123, 255, 0.7)',
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                hoverBorderColor: 'rgba(0, 123, 255, 0.7)',
                hoverBackgroundColor: 'rgba(0, 123, 255, 0.9)'
            }
        },
        createStackWind(stackId, data, dataDeg){
            return {
                stack: `Stack ${stackId}`,
                time: stackId.split(':').splice(0, 2).join(':'),
                dataDeg: dataDeg,
                data: data,
                borderWidth: 2,
                borderColor: 'rgba(0, 123, 255, 0.6)',
                backgroundColor: 'rgba(0, 123, 255, 0.4)',
                hoverBorderColor: 'rgba(0, 123, 255, 0.6)',
                hoverBackgroundColor: 'rgba(0, 123, 255, 0.8)'
            }
        },
        chartDataset(){
            if (this.listForecast.length) {
                let dataTempsForStack = {};
                let dataWindForStack = {};
                let dataWindDegForStack = {};

                let dataTempsForChart = [];
                let dataWindForChart = [];
                let dataLabelsForChart = [];

                let minTemp = 0;
                let maxTemp = 0;

                this.listForecast.forEach((item)=> {
                    let dateTimeArr = item.dt_txt.split(' ');
                    let date = dateTimeArr[0];
                    let time = dateTimeArr[1]; // time forecast (00, 03, 06, 09, 12, 15, 18, 21 h)

                    if (dataLabelsForChart.indexOf(date) === -1) {
                        dataLabelsForChart.push(date);
                    }

                    if (!dataTempsForStack[time]) {
                        dataTempsForStack[time] = [];
                        dataWindForStack[time] = [];
                        dataWindDegForStack[time] = [];
                    }

                    dataTempsForStack[time].push(utils.fixedToDec(item.main.temp, 1));
                    dataWindForStack[time].push(utils.fixedToDec(item.wind.speed, 1));
                    dataWindDegForStack[time].push(Math.round(item.wind.deg));
                    minTemp = Math.min(item.main.temp, minTemp);
                    maxTemp = Math.max(item.main.temp, maxTemp);
                });

                for (let stackId in dataTempsForStack) {
                    dataTempsForChart.push(this.createStackTemperature(stackId, dataTempsForStack[stackId]));
                    dataWindForChart.push(
                            this.createStackWind(stackId, dataWindForStack[stackId], dataWindDegForStack[stackId])
                    );
                }

                if (minTemp < 0) {
                    minTemp -= 5;
                }

                if (maxTemp > 0) {
                    maxTemp += 5;
                }

                this.chartOptionsTemperature.scales.yAxes[0].ticks.min = Math.ceil(minTemp);
                this.chartOptionsTemperature.scales.yAxes[0].ticks.max = Math.ceil(maxTemp);
                this.chartDataTemperature.labels = this.chartDataWind.labels = dataLabelsForChart.map((dateItem)=> {
                    return utils.replaceDate(dateItem);
                });
                this.chartDataHumidity.labels = this.chartDataPressure.labels = this.listForecast.map((item)=> {
                    return new Date(item.dt * 1e3);
                });

                this.chartDataTemperature.datasets = dataTempsForChart;
                this.chartDataWind.datasets = dataWindForChart;
                this.chartDataHumidity.datasets[0].data = this.listForecast.map((item)=> {
                    return item.main.humidity;
                });
                this.chartDataPressure.datasets[0].data = this.listForecast.map((item)=> {
                    return utils.fixedToDec(item.main.pressure - configs.normalPressure);
                });
                this.chartDataWind.datasets[0].data = this.listForecast.map((item)=> {
                    return item.wind.speed;
                });
            }
        },
        fixedToDec: utils.fixedToDec.bind(),
        showContent(block){
            this.isLoading = (block === 'loading');
            this.isError = (block === 'error');
            this.isSuccess = (block === 'success');
        },
        updateCurrentDate(){
            let date;

            if (this.currentForecast) {
                date = new Date(this.currentForecast.dt * 1e3);

                this.currentDate = {
                    dayName: configs.daysOfWeek[date.getDay()],
                    date: date.getDate(),
                    month: configs.months[date.getMonth()],
                    time: utils.formatting(date)
                }
            }
        },
        fetchData () {
            this.showContent('loading');

            this.queryCity = this.$route.params.city;
            if (this.queryCity) {
                forecastAPI
                        .fetch(this.queryCity)
                        .then(res => {
                            this.showContent('success');
                            this.cityForecast = res.data.city;
                            this.listForecast = res.data.list;
                        })
                        .catch(err => {
                            this.queryErr = err.response.data;
                            this.showContent('error');
                        });
            } else {
                this.queryErr = {
                    cod: null,
                    message: `Please enter valid city or zip`
                };
                this.showContent('error');
            }
        }
    }
};
</script>

<style scoped>
</style>
