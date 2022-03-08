<template>
  <v-dialog v-model="display" :width="dialogWidth">
    <template #activator="{ on }">
      <v-text-field
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        :error="error"
        :error-messages="errorMessages"
        readonly
        :solo="solo"
        :outlined="outlined"
        :color="color"
        :dark="dark"
        v-on="on"
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear color="primary" indeterminate absolute height="2" />
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-row class="pa-0 ma-0">
          <v-col cols="12" class="pa-0">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              full-width
            />
          </v-col>

          <v-col cols="12">
            <v-divider />
          </v-col>

          <v-col cols="12" :md="amPm ? 4 : 6">
            <v-autocomplete
              v-model="hour"
              class="text-center"
              :items="hours"
              solo
              :allow-overflow="false"
              append-icon=""
              type="number"
              hide-details
            />
          </v-col>

          <v-col cols="12" :md="amPm ? 4 : 6">
            <v-autocomplete
              v-model="minute"
              class="text-center"
              :items="minutes"
              solo
              :allow-overflow="false"
              append-icon=""
              type="number"
              hide-details
            />
          </v-col>

          <v-col v-if="amPm" cols="12" md="4">
            <v-autocomplete
              v-model="block"
              class="text-center"
              :items="['AM', 'PM']"
              solo
              :allow-overflow="false"
              append-icon=""
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="this">
          <v-btn
            color="grey lighten-1"
            text
            @click.native="clearHandler"
          >
            {{ clearText }}
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="okHandler"
          >
            {{ okText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, parse } from 'date-fns'
import { DEFAULT_DATE_FORMAT, DEFAULT_DIALOG_WIDTH, DEFAULT_CLEAR_TEXT, DEFAULT_OK_TEXT } from './utils/constants'

export default {
  model: {
    prop: 'datetime',
    event: 'input'
  },
  props: {
    datetime: { type: [Date, String], default: () => null },
    disabled: { type: Boolean, default: () => false },
    loading: { type: Boolean, default: () => false },
    label: { type: String, default: () => '' },
    dialogWidth: { type: Number, default: () => DEFAULT_DIALOG_WIDTH },
    dateFormat: { type: String, default: () => DEFAULT_DATE_FORMAT },
    clearText: { type: String, default: () => DEFAULT_CLEAR_TEXT },
    okText: { type: String, default: () => DEFAULT_OK_TEXT },
    textFieldProps: { type: Object, default: () => {} },
    datePickerProps: { type: Object, default: () => {} },
    timePickerProps: { type: Object, default: () => {} },

    error: { type: Boolean, default: () => false },
    errorMessages: { type: Array, default: () => [] },

    // Other field styles
    outlined: { type: Boolean, default: () => false },
    solo: { type: Boolean, default: () => false },

    color: { type: String, default: () => 'primary' },
    dark: { type: Boolean, default: () => false },
    
    amPm: { type: Boolean, default: () => false }
  },
  data () {
    return {
      display: false,
      activeTab: 0,
      date: null,
      hour: null,
      minute: null,
      block: null
    }
  },

  computed: {
    timeFormat () {
      return this.amPm ? 'hh:mm a' : 'HH:mm'
    },

    dateTimeFormat () {
      return this.dateFormat + ' ' + this.timeFormat
    },

    formattedDatetime () {
      return this.selectedDatetime ? format(this.selectedDatetime, this.dateTimeFormat) : ''
    },

    selectedDatetime () {
      if (this.date && this.hour && this.minute) {
        let time = `${this.hour}:${this.minute}`
        if (this.amPm) {
          time += ` ${this.block}`
        }
        console.log(time)
        const selectedDateTime = `${this.date} ${time}`
        return parse(selectedDateTime, this.dateTimeFormat, new Date())
      } else {
        return null
      }
    },

    hours () {
      return [...Array(this.amPm ? 12 : 24).keys()].map(item => {
        if (this.amPm) {
          item += 1
        }
        return item < 10 ? '0' + item : item.toString()
      })
    },

    minutes () {
      return [...Array(60).keys()].map(item => {
        return item < 10 ? '0' + item : item.toString()
      })
    }
  },

  watch: {
    datetime () {
      this.init()
    }
  },

  mounted () { this.init() },

  methods: {
    init () {
      if (!this.datetime) {
        return
      }

      let initDateTime
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime
      } else if (typeof this.datetime === 'string' || this.datetime instanceof String) {
        initDateTime = parse(this.datetime, this.dateTimeFormat, new Date())
      }

      this.date = format(initDateTime, DEFAULT_DATE_FORMAT)
      this.minute = format(initDateTime, 'mm')

      if (this.amPm) {
        this.hour = format(initDateTime, 'hh')
        this.block = format(initDateTime, 'a')
      } else {
        this.hour = format(initDateTime, 'HH')
        this.block = null
      }
    },
    okHandler () {
      this.resetPicker()
      this.$emit('input', this.selectedDatetime)
    },
    clearHandler () {
      this.resetPicker()
      this.date = null
      this.hour = null
      this.minute = null
      this.$emit('input', null)
    },
    resetPicker () {
      this.display = false
    }
  }
}
</script>
