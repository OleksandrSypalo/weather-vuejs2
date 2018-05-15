<template>
    <div>
        <b-card border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                footer-bg-variant="primary"
                footer-text-variant="white"

                title="Title"
                header-tag="header"
                footer-tag="footer"
        >
            <h6 slot="header" class="mb-0">Monday, 6 Febuary</h6>
            <div slot="footer">
                <b-row>
                    <b-col>
                        <b>text:</b>
                        <span>value</span>
                    </b-col>
                    <b-col>
                        <b>text:</b>
                        <span>value</span>
                    </b-col>
                    <b-col>
                        <b>text:</b>
                        <span>value</span>
                    </b-col>
                    <b-col>
                        <b>text:</b>
                        <span>value</span>
                    </b-col>
                </b-row>
            </div>
            <b-card-body>
                <p class="card-text">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
            </b-card-body>
        </b-card>
        <br/>
        <div>
            <h5 class="text-primary">Forecast 16 days</h5>
        </div>
        <b-card no-body border-variant="primary">
            <b-tabs card>
                <b-tab title="Wind">
                    Tab Contents 1
                </b-tab>
                <b-tab title="Temperature" active>
                    Tab Contents 2
                </b-tab>
                <b-tab title="Pressure">
                    Tab Contents 2
                </b-tab>
                <b-tab title="Humidity">
                    Tab Contents 2
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios'
import configs from '../configs'

const forecast = configs.forecast;

export default {
    name: 'Application',
    data () {
        return {
            currentData: {
                city: '',
                temperature: 0,
                pressure: 0,
                humidity: 0,
                windSpeed: 0,
                clouds: 0,
                date: '',
            },
            tabsData: {
                wind: [],
                temperature: [],
                pressure: [],
                humidity: []
            }
        }
    },
    mounted(){
        console.log(`${forecast.protocol}${forecast.url}?APPID=${forecast.apiId}&cnt=1&q=London`)
        axios
                .get(`${forecast.protocol}${forecast.url}?APPID=${forecast.apiId}&cnt=1&q=London`)
                .then((res) => {
                    console.log(res.data)
                });
    },
    methods: {},
    components: {}
};
</script>

<style scoped>
</style>
