import { setId, register, addRemoteGlobalThis } from '../shared/pipe'

setId('runtime')
addRemoteGlobalThis(window.parent)

register('RefreshUtils', require('$mometa-external:@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils'))
