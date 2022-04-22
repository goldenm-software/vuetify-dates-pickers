<template>
  <v-dialog
    v-model="display"
    :width="dialogWidth"
    @click:outside="okHandler"
  >
    <template #activator="{ on }">
      <v-text-field
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDateTime"
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
              v-model="dates"
              :title-date-format="parseDates"
              full-width
              show-adjacent-months
              range
            />
          </v-col>

          <v-col cols="12">
            <v-divider />
          </v-col>

          <v-col cols="12" md="6">
            <v-row no-gutters>
              <v-col cols="12" class="pa-0 ma-0">
                <h4 class="pa-0 ma-0 text-center">{{ startText }}</h4>
              </v-col>

              <v-col class="pr-1" cols="12" :md="amPm ? 4 : 6">
                <v-combobox
                  v-model="start.hour"
                  class="text-center"
                  :items="hours"
                  solo
                  :allow-overflow="false"
                  append-icon=""
                  type="number"
                  hide-details
                  hide-spin-buttons
                  auto-select-first
                  @change="validateStartHour"
                  @input="validateStartHour"
                />
              </v-col>

              <v-col class="pr-1" cols="12" :md="amPm ? 4 : 6">
                <v-combobox
                  v-model="start.minute"
                  class="text-center"
                  :items="minutes"
                  solo
                  :allow-overflow="false"
                  append-icon=""
                  type="number"
                  hide-details
                  hide-spin-buttons
                  auto-select-first
                  @change="validateStartMinute"
                  @input="validateStartMinute"
                />
              </v-col>

              <v-col v-if="amPm" cols="12" md="4">
                <v-autocomplete
                  v-model="start.amPm"
                  class="text-center"
                  :items="['AM', 'PM']"
                  solo
                  :allow-overflow="false"
                  append-icon=""
                  hide-details
                />
              </v-col>
            </v-row>
          </v-col>

          <v-divider vertical />

          <v-col cols="12" md="6">
            <v-row no-gutters>
              <v-col cols="12" class="pa-0 ma-0">
                <h4 class="pa-0 ma-0 text-center">{{ endText }}</h4>
              </v-col>

              <v-col class="pr-1" cols="12" :md="amPm ? 4 : 6">
                <v-combobox
                  v-model="end.hour"
                  class="text-center"
                  :items="hours"
                  solo
                  :allow-overflow="false"
                  append-icon=""
                  hide-details
                  type="number"
                  hide-spin-buttons
                  auto-select-first
                  @change="validateEndHour"
                  @input="validateEndHour"
                />
              </v-col>

              <v-col class="pr-1" cols="12" :md="amPm ? 4 : 6">
                <v-combobox
                  v-model="end.minute"
                  class="text-center"
                  :items="minutes"
                  solo
                  :allow-overflow="false"
                  append-icon=""
                  type="number"
                  hide-details
                  hide-spin-buttons
                  auto-select-first
                  @change="validateEndMinute"
                  @input="validateEndMinute"
                />
              </v-col>

              <v-col v-if="amPm" cols="12" md="4">
                <v-autocomplete
                  v-model="end.amPm"
                  class="text-center"
                  :items="['AM', 'PM']"
                  solo
                  :allow-overflow="false"
                  append-icon=""
                  hide-details
                />
              </v-col>
            </v-row>
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
import { DEFAULT_DATE_FORMAT, DEFAULT_DIALOG_WIDTH, DEFAULT_CLEAR_TEXT, DEFAULT_OK_TEXT, DEFAULT_START_TEXT, DEFAULT_END_TEXT } from './utils/constants'

export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: () => false },
    loading: { type: Boolean, default: () => false },
    label: { type: String, default: () => '' },
    dialogWidth: { type: Number, default: () => DEFAULT_DIALOG_WIDTH },
    dateFormat: { type: String, default: () => DEFAULT_DATE_FORMAT },
    clearText: { type: String, default: () => DEFAULT_CLEAR_TEXT },
    okText: { type: String, default: () => DEFAULT_OK_TEXT },
    startText: { type: String, default: () => DEFAULT_START_TEXT },
    endText: { type: String, default: () => DEFAULT_END_TEXT },
    textFieldProps: { type: Object, default: () => {} },
    datePickerProps: { type: Object, default: () => {} },

    error: { type: Boolean, default: () => false },
    errorMessages: { type: Array, default: () => [] },

    // Other field styles
    outlined: { type: Boolean, default: () => false },
    solo: { type: Boolean, default: () => false },

    color: { type: String, default: () => 'primary' },
    dark: { type: Boolean, default: () => false },

    amPm: { type: Boolean, default: () => false },

    defaultStartDate: { type: Function, default: null },
    defaultEndDate: { type: Function, default: null }
  },
  data () {
    return {
      display: false,
      activeTab: 0,

      start: {
        date: null,
        hour: null,
        minute: null,
        amPm: null
      },
      end: {
        date: null,
        hour: null,
        minute: null,
        amPm: null
      }
    }
  },

  computed: {
    dates: {
      get () {
        const result = []
        if (this.start.date) {
          result.push(this.start.date)
        }
        if (this.end.date) {
          result.push(this.end.date)
        }
        return result
      },

      set (dates) {
        this.start.date = dates[0]
        this.end.date = dates[1]
      }
    },

    timeFormat () {
      if (this.amPm) {
        return 'hh:mm a'
      }
      return 'HH:mm'
    },

    dateTimeFormat () {
      return this.dateFormat + ' ' + this.timeFormat
    },

    formattedDateTime () {
      let result = ''
      if (this.start.date && this.start.hour && this.start.minute) {
        if (this.amPm) {
          result = `${this.start.date} ${this.start.hour}:${this.start.minute} ${this.start.amPm}`
        } else {
          result = `${this.start.date} ${this.start.hour}:${this.start.minute}`
        }
      } else {
        result = 'N/A '
      }

      if (this.end.date && this.end.hour && this.end.minute) {
        if (this.amPm) {
          result += ` - ${this.end.date} ${this.end.hour}:${this.end.minute} ${this.end.amPm}`
        } else {
          result += ` - ${this.end.date} ${this.end.hour}:${this.end.minute}`
        }
      } else {
        result += ' - N/A'
      }
      return result
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
    },

    parsedValues () {
      let result = []
      if (this.start.date && this.start.hour && this.start.minute) {
        let dateTimeStr = `${this.start.date} ${this.start.hour}:${this.start.minute}`

        if (this.amPm) {
          dateTimeStr += ` ${this.start.amPm}`
        }

        result.push(parse(dateTimeStr, this.dateTimeFormat, new Date()))
      } else {
        result.push(null)
      }

      if (this.end.date && this.end.hour && this.end.minute) {
        let dateTimeStr = `${this.end.date} ${this.end.hour}:${this.end.minute}`

        if (this.amPm) {
          dateTimeStr += ` ${this.end.amPm}`
        }

        result.push(parse(dateTimeStr, this.dateTimeFormat, new Date()))
      } else {
        result.push(null)
      }

      if (result[0].getTime() > result[1].getTime()) {
        /*
          If the user clicked the end date before the start date,
          flip them around, the start of an interval should always be
          in a date previous to the end of the interval.
        */
        result = [
          result[1],
          result[0]
        ]
      }

      return result
    }
  },

  watch: {
    value () { this.init() },
    amPm () { this.init() }
  },

  mounted () { this.init() },

  methods: {
    parseDates (dates) {
      return dates.join(' - ')
    },

    init () {
      if (this.value.length !== 2) {
        return ''
      }

      let start
      if (typeof this.value[0] === 'string') {
        start = parse(this.value[0], this.dateTimeFormat, new Date())
      } else {
        start = this.value[0]
      }

      this.start.date = format(start, this.dateFormat)
      this.start.minute = format(start, 'mm')

      if (this.amPm) {
        this.start.hour = format(start, 'hh')
        if (parseInt(this.start.hour) > 12) {
          this.start.hour = (parseInt(this.start.hour) - 12).toString()
          this.start.hour = this.start.hour.length === 1 ? '0' + this.start.hour : this.start.hour
        }
        this.start.amPm = format(start, 'a')
      } else {
        this.start.hour = format(start, 'HH')
      }

      let end
      if (typeof this.value[1] === 'string') {
        end = parse(this.value[1], this.dateTimeFormat, new Date())
      } else {
        end = this.value[1]
      }

      this.end.date = format(end, this.dateFormat)
      this.end.minute = format(end, 'mm')

      if (this.amPm) {
        this.end.hour = format(end, 'hh')
        if (parseInt(this.end.hour) > 12) {
          this.end.hour = (parseInt(this.end.hour) - 12).toString()
          this.end.hour = this.end.hour.length === 1 ? '0' + this.end.hour : this.end.hour
        }
        this.end.amPm = format(end, 'a')
      } else {
        this.end.hour = format(end, 'HH')
      }
    },

    okHandler () {
      this.resetPicker()
      this.$emit('input', this.parsedValues)
    },

    resetDateValues () {
      this.start = {
        date: null,
        hour: null,
        minute: null,
        amPm: null
      }
      this.end = {
        date: null,
        hour: null,
        minute: null,
        amPm: null
      }
    },

    clearHandler () {
      this.resetDateValues()
      let start
      let end
      if (this.defaultStartDate != null) {
        start = this.defaultStartDate()
      } else {
        start = new Date((new Date() - 1000 * 60 * 60))
      }
      if (this.defaultEndDate != null) {
        end = this.defaultEndDate()
      } else {
        end = new Date()
      }

      this.$emit('input',
        [
          start,
          end
        ]
      )
    },
    validateStartMinute () {
      if (this.start.minute.length > 2) {
        // this.start.minute = this.start.minute.slice(this.start.minute.length - 2, this.start.minute.length)
        this.$set(this.start, 'minute', this.start.minute.slice(this.start.minute.length - 2, this.start.minute.length))

        if (!this.minuteRule(this.start.minute)) {
          // this.start.minute = '00'
          this.$set(this.start, 'minute', '00')
        }
      }
    },
    validateStartHour () {
      if (this.start.hour.length > 2) {
        // this.start.hour = this.start.hour.slice(this.start.hour.length - 2, this.start.hour.length)
        this.$set(this.start, 'hour', this.start.hour.slice(this.start.hour.length - 2, this.start.hour.length))

        if (this.amPm) {
          if (!this.hourAmPmRule(this.start.hour)) {
            // this.start.hour = '01'
            this.$set(this.start, 'hour', '01')
          }
        } else {
          if (!this.hourMilitaryRule(this.start.hour)) {
            // this.start.hour = '00'
            this.$set(this.start, 'hour', '00')
          }
        }
      }
    },
    validateEndMinute () {
      if (this.end.minute.length > 2) {
        // this.end.minute = this.end.minute.slice(this.end.minute.length - 2, this.end.minute.length)
        this.$set(this.end, 'minute', this.end.minute.slice(this.end.minute.length - 2, this.end.minute.length))

        if (!this.minuteRule(this.end.minute)) {
          // this.end.minute = '00'
          this.$set(this.end, 'minute', '00')
        }
      }
    },
    validateEndHour () {
      if (this.end.hour.length > 2) {
        // this.end.hour = this.end.hour.slice(this.end.hour.length - 2, this.end.hour.length)
        this.$set(this.end, 'hour', this.end.hour.slice(this.end.hour.length - 2, this.end.hour.length))

        if (this.amPm) {
          if (!this.hourAmPmRule(this.end.hour)) {
            // this.end.hour = '01'
            this.$set(this.end, 'hour', '01')
          }
        } else {
          if (!this.hourMilitaryRule(this.end.hour)) {
            // this.end.hour = '00'
            this.$set(this.end, 'hour', '00')
          }
        }
      }
    },

    resetPicker () {
      this.display = false
    },
    minuteRule (value) {
      value = parseInt(value)
      return value >= 0 && value <= 59
    },
    hourMilitaryRule (value) {
      value = parseInt(value)
      return value >= 0 && value <= 23
    },
    hourAmPmRule (value) {
      value = parseInt(value)
      return value >= 1 && value <= 12
    }
  }
}
</script>
