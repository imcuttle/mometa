import React from 'react'
import { Select, InputNumber } from 'antd'
import p from 'prefix-classname'
import { throttle } from 'lodash-es'
import { CloseOutlined } from '@ant-design/icons'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import usePersistFn from '@rcp/use.persistfn'
import useUncontrolled from '@rcp/use.uncontrolled'
import * as maker from 'element-resize-detector'

const cn = p('')
const c = p(`${CLS_PREFIX}-resize-widget`)

export interface ResizeWidgetProps {
  className?: string
  container?: HTMLElement
  getContainerSize?: (container: HTMLElement) => { width: number; height: number }
  value?: {
    rateType: any
    rate: any
    type: any
    data?: any
    width: any
    height: any
  }
  onChange?: (v: ResizeWidgetProps['value']) => void
}

const OPTIONS = [
  { value: 'custom', label: '自适应' },
  { value: 'moto-g4', label: 'Moto G4', data: { width: 360, height: 640 } },
  { value: 'galaxy-s5', label: 'Galaxy S5', data: { width: 360, height: 640 } },
  { value: 'pixel-2', label: 'Pixel 2', data: { width: 411, height: 731 } },
  { value: 'iphone-678', label: 'iPhone 6/7/8', data: { width: 375, height: 667 } },
  { value: 'iphone-678-plus', label: 'iPhone 6/7/8 Plus', data: { width: 414, height: 736 } },
  { value: 'iphone-x', label: 'iPhone X', data: { width: 375, height: 812 } },
  { value: 'ipad', label: 'iPad', data: { width: 768, height: 1024 } },
  { value: 'ipad-pro', label: 'iPad Pro', data: { width: 1024, height: 1366 } }
]

const RATE_OPTIONS = [
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 1, label: '100%' },
  { value: 1.25, label: '125%' },
  { value: 1.5, label: '150%' },
  { value: 'fit', label: '适合窗口' }
]

export const defaultValue = {
  rateType: 1,
  rate: 1,
  type: 'iphone-x',
  data: {
    custom: { width: 360, height: 640 }
  },
  width: 360,
  height: 640
}

const MyInputNumber = ({ value, onChange, ...props }) => {
  const [v, setV] = useUncontrolled({ value, onChange })
  const handleValChange = usePersistFn((v) => {
    if (isNaN(v)) {
      setV(value)
    } else {
      setV(Number(v))
    }
  })
  return (
    <InputNumber
      {...props}
      value={v}
      min={1}
      onStep={(v, info) => {
        handleValChange(v)
      }}
      onPressEnter={(e: any) => {
        handleValChange(e.target.value)
      }}
      onBlur={(e: any) => {
        handleValChange(e.target.value)
      }}
    />
  )
}

const ResizeWidget: React.FC<ResizeWidgetProps> = React.memo(
  ({
    className,
    container,
    getContainerSize = (elem) => ({ width: elem.clientWidth, height: elem.clientHeight }),
    value = defaultValue,
    onChange
  }) => {
    const [val, _setValue] = useUncontrolled({
      value,
      onChange
    })
    const setVal = usePersistFn((key, v) => {
      _setValue((x) => {
        const newVal = {
          ...x,
          [key]: v
        }

        if (key === 'type') {
          if (v === 'custom') {
            Object.assign(newVal, {
              width: newVal.data?.custom?.width ?? newVal.width,
              height: newVal.data?.custom?.height ?? newVal.height
            })
          } else {
            const data = OPTIONS.find((x) => x.value === v)?.data
            Object.assign(newVal, data)
          }
        } else if (key === 'width' || key === 'height') {
          if (newVal.type === 'custom') {
            newVal.data = newVal.data ?? {}
            newVal.data.custom = newVal.data.custom ?? {}
            Object.assign(newVal.data.custom, {
              [key]: v
            })
          }
        } else if (key === 'rateType') {
          if (v !== 'fit') {
            newVal.rate = v
          }
        }
        return newVal
      })
    })

    React.useLayoutEffect(() => {
      if (container && val?.rateType === 'fit') {
        const erd = maker()
        const handler = throttle((elem) => {
          const size = getContainerSize(elem)
          const minRate = Math.min(size.width / val.width, size.height / val.height).toFixed(1)
          setVal('rate', minRate)
        }, 200)

        erd.listenTo(container, handler)
        return () => {
          erd.removeListener(container, handler)
        }
      }
    }, [val?.rateType, container, getContainerSize, setVal])

    return (
      <div className={cn(c(), className)}>
        <Select
          options={OPTIONS}
          value={val.type}
          onChange={(val) => setVal('type', val)}
          style={{ width: 'auto', minWidth: 80 }}
          dropdownMatchSelectWidth={150}
          size={'small'}
        />
        <span>
          <MyInputNumber
            value={val.width}
            disabled={val.type !== 'custom'}
            onChange={(val) => setVal('width', val)}
            style={{ width: '70px' }}
            size={'small'}
          />
          <CloseOutlined style={{ fontSize: 10, paddingLeft: 4, paddingRight: 4 }} />
          <MyInputNumber
            disabled={val.type !== 'custom'}
            value={val.height}
            onChange={(val) => setVal('height', val)}
            style={{ width: '70px' }}
            size={'small'}
          />
        </span>
        <Select
          value={val.rateType}
          onChange={(val) => setVal('rateType', val)}
          options={RATE_OPTIONS}
          style={{ width: 'auto', minWidth: 60 }}
          dropdownMatchSelectWidth={100}
          size={'small'}
        />
      </div>
    )
  }
)

ResizeWidget.defaultProps = {}

export default ResizeWidget
