<template>
  <v-dialog v-model="display" :width="dialogWidth">
    <template #activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
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
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>mdi-calendar</v-icon>
            </slot>
          </v-tab>
          <v-tab
            key="timer"
          >
            <slot name="timeIcon">
              <v-icon>mdi-clock</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              :disabled="disableDate"
              :title-date-format="titleDate"
              full-width
              @input="showTimePicker"
            />
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              v-model="time"
              class="v-time-picker-custom"
              :ampm-in-title="timerAmpmInTitle"
              v-bind="timePickerProps"
              :disabled="disableTime"
              full-width
            />
          </v-tab-item>
        </v-tabs>
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
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, DEFAULT_DIALOG_WIDTH, DEFAULT_CLEAR_TEXT, DEFAULT_OK_TEXT } from './utils/constants'

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
    timeFormat: { type: String, default: () => 'HH:mm' },
    clearText: { type: String, default: () => DEFAULT_CLEAR_TEXT },
    okText: { type: String, default: () => DEFAULT_OK_TEXT },
    textFieldProps: { type: Object, default: () => {} },
    datePickerProps: { type: Object, default: () => {} },
    timePickerProps: { type: Object, default: () => {} },

    // Other field styles
    outlined: { type: Boolean, default: () => false },
    solo: { type: Boolean, default: () => false },

    color: { type: String, default: () => 'primary' },
    dark: { type: Boolean, default: () => false },
    /**
     * Disables time edition in dialog
     */
    disableTime: { type: Boolean, default: () => false },
    /**
     * Disables date edition in dialog
     */
    disableDate: { type: Boolean, default: () => false },
    timerAmpmInTitle: { type: Boolean, default: () => false }
  },
  data () {
    return {
      display: false,
      activeTab: 0,
      date: null,
      time: null
    }
  },

  computed: {
    dateTimeFormat () {
      return this.dateFormat + ' ' + this.timeFormat
    },
    defaultDateTimeFormat () {
      return DEFAULT_DATE_FORMAT + ' ' + DEFAULT_TIME_FORMAT
    },
    formattedDatetime () {
      return this.selectedDatetime ? format(this.selectedDatetime, this.dateTimeFormat) : ''
    },
    selectedDatetime () {
      if (this.date && this.time) {
        let datetimeString = this.date + ' ' + this.time
        if (this.time.length === 5) {
          datetimeString += ':00'
        }
        return parse(datetimeString, this.defaultDateTimeFormat, new Date())
      } else {
        return null
      }
    }
    // dateSelected() {
    //   return !this.date
    // }
  },

  watch: {
    datetime () {
      this.init()
    },
    display () {
      if (this.disableDate) {
        this.activeTab = 1
      } else {
        this.activeTab = 0
      }
    }
  },

  mounted () { this.init() },

  methods: {
    titleDate (date) {
      return format(parse(date, DEFAULT_DATE_FORMAT, new Date()), this.dateFormat)
    },
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
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT)
    },
    okHandler () {
      this.resetPicker()
      this.$emit('input', this.selectedDatetime)
    },
    clearHandler () {
      this.resetPicker()
      this.date = null
      this.time = null
      this.$emit('input', null)
    },
    resetPicker () {
      this.display = false
      if (this.disableDate) {
        this.activeTab = 1
      } else {
        this.activeTab = 0
      }
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true
      }
    },
    showTimePicker () {
      if (!this.disableTime) {
        this.activeTab = 1
      }
    }
  }
}
</script>
