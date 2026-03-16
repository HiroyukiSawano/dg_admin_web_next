
import configs from './configs'
import { permission, permissionRole } from './utils/permission'
// import request from './utils/request'
// import services from './services'

import vAuth from './directives/vAuth'
import vAuths from './directives/vAuths'
import vAuthsAll from './directives/vAuthsAll'
import vRole from './directives/vRole'
import vTime from './directives/vTime'
import vCopy from './directives/vCopy'

import { errorHandler } from './utils/handler'
import { translate } from './locales'
import * as elIcons from '@element-plus/icons-vue'
import * as riIcons from '@remixicon/vue'

export default {
  install(app) {
    app.config.globalProperties.$configs = configs
    // app.config.globalProperties.$request = request
    // app.config.globalProperties.$services = services
    app.config.globalProperties.$auth = permission
    app.config.globalProperties.$role = permissionRole
    app.config.globalProperties.$translate = translate

    app.directive('auth', vAuth)
    app.directive('auths', vAuths)
    app.directive('auths-all', vAuthsAll)
    app.directive('role', vRole)
    app.directive('time', vTime)
    app.directive('copy', vCopy)

    for (const icon in elIcons) {
      app.component(`ElIcon${icon}`, elIcons[icon])
    }

    for (const icon in riIcons) {
      app.component(`${icon}`, riIcons[icon])
    }

    //关闭async-validator全局控制台警告
    window.ASYNC_VALIDATOR_NO_WARNING = 1

    //全局代码错误捕捉
    // app.config.errorHandler = errorHandler
  },
}
