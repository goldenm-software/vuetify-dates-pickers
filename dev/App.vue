<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h2>AM/PM</h2>
            <v-switch
              v-model="amPm"
              outlined
            />
          </v-col>

          <v-col cols="12">
            <h2>Classic</h2>
            {{ classic }}
            <classic-picker
              v-model="classic"
              date-format="MM-dd-yyyy"
              outlined
            />
          </v-col>

          <v-col cols="12">
            <h2>Modern</h2>
            {{ modern }}
            <modern-picker
              v-model="modern"
              outlined
              date-format="MM-dd-yyyy"
              :am-pm="amPm"
            />
          </v-col>

          <v-col cols="12">
            <h2>Date Range</h2>
            {{ dateRange }}
            <date-range-picker
              v-model="dateRange"
              date-format="MM-dd-yyyy"
              outlined
            />
          </v-col>

          <v-col cols="12">
            <h2>Date Time Range</h2>
            {{ dateTimeRange }}
            <date-time-range-picker
              v-model="dateTimeRange"
              outlined
              date-format="MM-dd-yyyy"
              :am-pm="amPm"
            />
          </v-col>
          <v-col cols="12">
            <h2>Date Time Range 2</h2>
            {{ dateTimeRange }}
            <date-time-range-picker
              v-model="dateTimeRange"
              date-format="MM-dd-yyyy"
              clearText="CLEAR"
              okText="OK"
              color="primary"
              label="Picker"
              dense
              hide-details
              outlined
              am-pm
              :errorMessages="[]"
              :dialogWidth="400"
              :defaultStartDate="defaultStartDate"
              append-icon="mdi-home"
              @click:append="onClickAppend"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Classic, Modern, DateRange, DateTimeRange } from '@'
export default {
  components: {
    'classic-picker': Classic,
    'modern-picker': Modern,
    'date-range-picker': DateRange,
    'date-time-range-picker': DateTimeRange
  },

  data () {
    return {
      classic: new Date(),
      modern: new Date(),
      dateRange: [
        new Date((new Date() - 1000 * 60 * 60)),
        new Date()
      ],
      dateTimeRange: [
        // 1000 ms 60s 60m 24h
        new Date((new Date() - 1000 * 60 * 60 * 24)),
        new Date()
      ],
      amPm: false
    }
  },
  methods: {
    defaultStartDate () {
      return new Date((new Date() - 1000 * 60 * 60 * 24))
    },

    onClickAppend () {
      console.log('onClickAppend')
    }
  }
}
</script>