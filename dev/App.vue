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
              outlined
            />
          </v-col>

          <v-col cols="12">
            <h2>Modern</h2>
            {{ modern }}
            <modern-picker
              v-model="modern"
              outlined
              :am-pm="amPm"
            />
          </v-col>

          <v-col cols="12">
            <h2>Date Range</h2>
            {{ dateRange }}
            <date-range-picker
              v-model="dateRange"
              outlined
            />
          </v-col>

          <v-col cols="12">
            <h2>Date Time Range</h2>
            {{ dateTimeRange }}
            <date-time-range-picker
              v-model="dateTimeRange"
              outlined
              :am-pm="amPm"
            />
          </v-col>
          <v-col cols="12">
            <h2>Date Time Range 2</h2>
            {{ dateTimeRange }}
            <date-time-range-picker
              v-model="dateTimeRange"
              dateFormat="yyyy-MM-dd"
              clearText="CLEAR"
              okText="OK"
              color="primary"
              label="Picker"
              :disabled="false"
              :loading="false"
              :outlined="false"
              :solo="false"
              :dark="false"
              am-pm
              :error="false"
              :errorMessages="[]"
              :dialogWidth="400"
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
        new Date((new Date() - 1000 * 60 * 60)),
        new Date()
      ],
      amPm: false
    }
  }
}
</script>