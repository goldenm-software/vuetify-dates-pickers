<template>
  <v-dialog v-model="display" :width="dialogWidth">
    <template #activator="{ on }">
      <v-text-field
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDate"
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
    prop: 'value',
    event: 'input'
  },
  props: {
    value: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: () => false },
    loading: { type: Boolean, default: () => false },
    label: { type: String, default: () => '' },
    dialogWidth: { type: Number, default: () => DEFAULT_DIALOG_WIDTH * 1.5 },
    dateFormat: { type: String, default: () => DEFAULT_DATE_FORMAT },
    clearText: { type: String, default: () => DEFAULT_CLEAR_TEXT },
    okText: { type: String, default: () => DEFAULT_OK_TEXT },
    textFieldProps: { type: Object, default: () => {} },
    datePickerProps: { type: Object, default: () => {} },

    error: { type: Boolean, default: () => false },
    errorMessages: { type: Array, default: () => [] },

    // Other field styles
    outlined: { type: Boolean, default: () => false },
    solo: { type: Boolean, default: () => false },

    color: { type: String, default: () => 'primary' },
    dark: { type: Boolean, default: () => false }
  },
  data () {
    return {
      display: false,
      activeTab: 0,
      start: null,
      end: null
    }
  },

  computed: {
    dates: {
      get () {
        const result = []
        if (this.start) {
          result.push(this.start)
        }
        if (this.end) {
          result.push(this.end)
        }
        return result
      },
      set (dates) {
        this.start = dates[0]
        this.end = dates[1]
      }
    },
    formattedDate () {
      let result = ''
      if (this.start) {
        result = this.start
      } else {
        result = 'N/A '
      }

      if (this.end) {
        result += ` - ${this.end}`
      } else {
        result += ' - N/A'
      }
      return result
    }
  },

  watch: {
    value () {
      this.init()
    }
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

      if (typeof this.value[0] === 'string') {
        this.start = this.value[0]
      } else {
        this.start = format(this.value[0], this.dateFormat)
      }

      if (typeof this.value[1] === 'string') {
        this.end = this.value[1]
      } else {
        this.end = format(this.value[1], this.dateFormat)
      }
    },

    okHandler () {
      this.resetPicker()
      this.$emit('input', [
        parse(this.start, this.dateFormat, new Date()),
        parse(this.end, this.dateFormat, new Date())
      ])
    },

    clearHandler () {
      this.resetPicker()
      this.star = null
      this.end = null
      this.$emit('input', [])
    },

    resetPicker () {
      this.display = false
    }
  }
}
</script>
