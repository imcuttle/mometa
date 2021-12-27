import React from 'react'
import p from 'prefix-classname'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { CLS_PREFIX } from '../../config/const'
import Header, { useHeaderStatus } from '../components/header'
import Stage, { StageProps } from '../components/stage'
import RightPanel, { RightPanelProps } from '../components/right-panel'
import LeftPanel, { LeftPanelProps } from '../components/left-panel'

import { SharedProvider, useSharedProvider } from '@rcp/use.shared'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './style.scss'
import createApi from '../components/stage/create-api'
import { createClientConnection } from './sse'

const cn = p('')
const c = p(`${CLS_PREFIX}`)

export interface EditorProps {
  className?: string
  apiBaseURL?: string
  bundlerURL?: StageProps['bundlerURL']
  stageProps?: StageProps
  leftPanelProps?: LeftPanelProps
  rightPanelProps?: RightPanelProps
}

function CollapseBtn({ hide, dir, onClick }: any) {
  const title = hide ? '展开' : '收起'
  const style = {
    cursor: 'pointer',
    color: '#1890ff'
  }

  return (
    <div onClick={onClick} className={c('__collapse', `-collapse-${dir}`, `-collapse-${hide ? 'hide' : 'show'}`)}>
      <Tooltip title={title}>
        {((hide && dir === 'left') || (!hide && dir === 'right')) && <DoubleLeftOutlined style={style} />}
        {((hide && dir === 'right') || (!hide && dir === 'left')) && <DoubleRightOutlined style={style} />}
      </Tooltip>
    </div>
  )
}

const Body = ({ className, apiBaseURL, leftPanelProps, rightPanelProps, stageProps, bundlerURL }: EditorProps) => {
  const [mats, setMats] = React.useState([])
  React.useEffect(() => {
    const conn = createClientConnection(apiBaseURL + 'sse')
    conn.addHandler((data) => {
      switch (data.type) {
        case 'set-materials': {
          setMats(data.data ?? [])
        }
      }
    })
    //
    return () => {
      conn.close()
    }
  }, [apiBaseURL])

  const api = React.useMemo(() => createApi(apiBaseURL), [apiBaseURL])
  useSharedProvider(api, { key: 'api' })
  const [{ canSelect }] = useHeaderStatus()

  const [hideLeft, setHideLeft] = React.useState(false)
  const [hideRight, setHideRight] = React.useState(false)
  React.useEffect(() => {
    setHideLeft(!canSelect)
    setHideRight(!canSelect)
  }, [canSelect])

  return (
    <div className={cn(c(), className)}>
      <Header bundlerURL={bundlerURL} />
      <div className={c('__main-content')}>
        <div className={c('__panel')}>
          <LeftPanel {...leftPanelProps} className={c('__l-panel', hideLeft && '-hide')} materials={mats} />
          <CollapseBtn onClick={() => setHideLeft((x) => !x)} hide={hideLeft} dir={'left'} />
        </div>
        <Stage bundlerURL={bundlerURL} {...stageProps} className={c('__stage')} />
        <div className={c('__panel')}>
          <RightPanel {...rightPanelProps} className={c('__r-panel', hideRight && '-hide')} />
          <CollapseBtn onClick={() => setHideRight((x) => !x)} hide={hideRight} dir={'right'} />
        </div>
      </div>
    </div>
  )
}

ConfigProvider.config({
  prefixCls: 'mmt-ant'
})

const Editor: React.FC<EditorProps> = React.memo((props) => {
  return (
    <SharedProvider>
      <ConfigProvider locale={zhCN} prefixCls={'mmt-ant'}>
        <DndProvider backend={HTML5Backend}>
          <Body {...props} />
        </DndProvider>
      </ConfigProvider>
    </SharedProvider>
  )
})

Editor.defaultProps = {
  apiBaseURL: 'http://localhost:8686/',
  bundlerURL: '/bundler.html'
}

export default Editor
