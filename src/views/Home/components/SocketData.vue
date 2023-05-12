<template>
  <b-row>
    <transition mode="out-in" name="shrink-fade">

      <b-col cols="12" v-if="(!$root.onRequest && !chartData.length) || $root.onRequest" key="nothing">
        <nothing-to-show :title="$root.onRequest ? 'Almost there..' : 'Nothing yet to show..'"
          :starting="$root.onRequest" />
      </b-col>

      <b-col cols="12" v-else key="fullfilledbody">
        <h3>Memory Monitor</h3>
        <h5>
          Overall Memory Usage <span class="badge badge-primary">{{ overallMemory }}</span>
        </h5>
        <BBadge variant="info"><small>Last update: {{ lastUpdatedAt }} </small></BBadge>
        <b-row class="mt-5">

          <b-col cols="12" md="2">
            <b-card class="shadow rounded bg-white p-3">
              <h5 class="mb-3">Hidden</h5>
              <ul class="text-center">
                <li v-for="(item, index) in blacklisted" :key="index">
                  {{ item }}
                  <fa-icon icon="times" class="pointer" @click="blacklisted.splice(index, 1)" />
                </li>
              </ul>
            </b-card>
            <b-card>
              Jobs:
              <b-badge variant="primary">{{ chartData.length }}</b-badge>
              <!-- render job titles with link to the hash -->
              <ul class="text-center">
                <li v-for="(item, index) in chartData" :key="index">
                  <a :href="`#${index}`" @click="hash = index">{{ item.title || 'Unnamed job' }}</a>
                </li>
              </ul>
            </b-card>
          </b-col>
          <b-col cols="12" md="10">

            <b-row>

              <b-col cols="12" lg="6" v-for="(item, index) in chartData" :key="index" class="my-2 tech-wrapper">
                <!-- remove the chart from the array and blacklist -->
                <div class="close pointer mr-2" v-b-tooltip="'Hide'" @click="hide(item.title)">&times;</div>
                <div class="shadow rounded bg-white p-3" :class="{ highlight: +hash === index }">
                  <h5 class="mb-3" :id="index">{{ item.title || 'Unnamed job' }}</h5>
                  <h6 class="mb-0">{{ item.task || 'Unnamed task' }}</h6>
                  <BBadge variant="info" class="mb-3"><small>Last update: {{ item.labels.at(-1) }} </small></BBadge>

                  <b-row>
                    <b-col cols="2" offset="1">
                      <b>Max</b><br /> <span class="badge badge-primary">{{ item.heapTotal.toFixed(2) || 0 }}MB</span>
                    </b-col>
                    <b-col cols="2">
                      <b>Peak</b><br /> <span class="badge badge-primary">{{ getPeak(item.datasets) }}</span>
                    </b-col>
                    <b-col cols="2">
                      <b>Min</b><br /><span class="badge badge-primary"> {{ getMin(item.datasets) }}</span>
                    </b-col>
                    <b-col cols="2">
                      <b>Avg</b><br /> <span class="badge badge-primary">{{ getAvg(item.datasets) }}</span>
                    </b-col>
                    <b-col cols="2">
                      <b>Current</b><br /> <span class="badge badge-primary">{{ getCurrent(item.datasets) }}</span>
                    </b-col>
                  </b-row>


                  <bar :data="item" :options="chartOptions" />
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </transition>
  </b-row>
</template>
<script>
import io from "socket.io-client";
import NothingToShow from "@/components/NothingToShow/NothingToShow";

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import moment from "moment";
import { BBadge, BListGroup } from "bootstrap-vue";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: "SocketData",
  components: {
    NothingToShow,
    Bar,
    BListGroup,
    BBadge
  },
  data() {
    return {
      socket: null,
      socketData: {},
      rowLimit: 10000,
      chartData: [],
      lastUpdatedAt: 0,
      blacklisted: [],
      hash: null,
      chartOptions: {
        plugins: {
          legend: {
            display: false,
          }
        },

        // name x Axis as timestamp and y as MB chartjs options
        scales: {
          x: {
            title: {
              display: true,
              text: 'Timestamp'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Memory (MB)'
            }
          }
        },
      }
    };
  },
  methods: {
    hide(title) {
      this.blacklisted.push(title);
      this.chartData = this.chartData.filter(item => item.title !== title);
    },
    getPeak(data) {
      const peak = Math.max(...data[0].data);
      return peak.toFixed(2) + 'MB';
    },
    getMin(data) {
      const min = Math.min(...data[0].data);
      return min.toFixed(2) + 'MB';
    },
    getAvg(data) {
      const avg = data[0].data.reduce((a, b) => a + b, 0) / data[0].data.length;
      return avg.toFixed(2) + 'MB';
    },
    getCurrent(data) {
      const current = data[0].data[data[0].data.length - 1];
      return current.toFixed(2) + 'MB';
    },
    connect: function () {
      if (!this.socketData.length) this.$root.onRequest = true;
      this.disconnect();

      this.socket = io("https://api-dnr.andremury.com");

      const pushData = (data) => {
        const objName = data.job;
        data.timestamp = Date.now();
        if (!this.socketData[objName]) this.socketData[objName] = [];
        this.socketData[objName].push(data);

        if (this.socketData[objName].length > this.rowLimit) {
          this.socketData[objName].shift();
        }

        this.makeChartData();
        this.lastUpdatedAt = moment().format('HH:mm:ss');
      }

      this.socket.on("job-monitor", data => {
        if (data) {
          // data processing
          pushData(data);
          if (this.$root.onRequest) this.$root.onRequest = false;
        }
      });
    },
    disconnect: function () {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },

    makeChartData() {
      const chartData = [];
      for (const [key, value] of Object.entries(this.socketData)) {
        if (this.blacklisted.includes(key)) continue;
        const chart = {
          labels: value.map(item => moment(item.timestamp).format('HH:mm:ss')),
          datasets: [{ data: value.map(item => item.heapUsed) }],
          title: key,
          task: value[0].task,
          heapTotal: value[0].heapTotal
        }
        chartData.push(chart);
      }
      this.chartData = chartData;
    }
  },
  computed: {
    computedData() {
      return this.chartData;
    },

    overallMemory() {
      // sum all heapUsed values
      const sum = this.chartData.reduce((a, b) => a + b.datasets[0].data[b.datasets[0].data.length - 1], 0);
      return sum.toFixed(2) + 'MB';
    },

  },
  mounted() {
    this.$nextTick(() => {
      this.connect();
    });
  },
  beforeDestroy() {
    this.disconnect();
  }
};
</script>
<style scoped>
.tech-wrapper {
  animation: slide 1s forwards;
}

.text-center {
  list-style: none;
  padding: 0;
  margin: 0;
}

@keyframes slide {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(-0);
  }
}

.highlight {
  /** add orange border */
  border: 2px solid #f0ad4e;
}
</style>
