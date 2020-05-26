import { t } from '../local/index'

export default {
  methods: {
    t(...args) {
      return t.apply(this, args)
    }
  }
}
