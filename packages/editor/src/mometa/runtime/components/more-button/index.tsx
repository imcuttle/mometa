import React from 'react'
import p from 'prefix-classname'
import { MenuOutlined } from '@ant-design/icons'
import { CLS_PREFIX } from '../../../config/const'

import { Button, Dropdown, Menu } from 'antd'
import { MometaHTMLElement } from '../../dom-api'
import { getSharedFromMain, useSelectedNode } from '../../../utils/get-from-main'
const { api } = getSharedFromMain()

import './style.scss'
import { getDomName } from '../../../utils/dom-utils'

const cn = p('')
const c = p(`${CLS_PREFIX}-more-button`)

export interface MoreButtonProps {
  className?: string
  dom: MometaHTMLElement
  menu?: React.ReactNode
}

const MoreButton: React.FC<MoreButtonProps> = React.memo(({ className, dom, menu }) => {
  const [, setSelectedNode] = useSelectedNode()
  const [paths, setPaths] = React.useState(null)

  const renderMenuItem = ({ mometa: data, dom: _dom }, i = 0) => {
    const isActive = dom.__mometa.getKey() === data.hash
    return (
      <Menu.Item
        key={`${data.hash}-${i}`}
        className={c({ '-active': isActive })}
        disabled={isActive}
        onClick={() => {
          setSelectedNode(null)
          _dom.__mometa.selectedKey = data.hash
          setSelectedNode(_dom)
        }}
      >
        <span>
          {!!data.container && '*'}
          {data.name}
        </span>
        {!!isActive && <span> (自己)</span>}
      </Menu.Item>
    )
  }

  return (
    <Dropdown
      className={c('__dropdown')}
      overlay={
        <Menu>
          {!!menu && (
            <>
              {menu}
              <Menu.Divider />
            </>
          )}
          <Menu.SubMenu key={'level'} title={'选中层级'} popupOffset={[0, 0]}>
            {!!paths &&
              Array.from(paths.keys()).map((groupDom, i) => {
                const list = paths.get(groupDom)
                if (!list.length) {
                  return null
                }
                if (list.length > 1) {
                  return (
                    <Menu.ItemGroup key={`group-${i}`} title={`${getDomName(groupDom as any)} (DOM)`}>
                      {list.map(renderMenuItem)}
                    </Menu.ItemGroup>
                  )
                }

                return renderMenuItem(list[0])
              })}
          </Menu.SubMenu>
          <Menu.Item
            key={'cancel-select'}
            onClick={() => {
              setSelectedNode(null)
            }}
          >
            取消选中
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            key={'copy'}
            onClick={() => {
              return api.handleViewOp('copy', dom)
            }}
          >
            重复一份
          </Menu.Item>
        </Menu>
      }
      onVisibleChange={(v) => {
        if (v && !paths) {
          const paths = new Map()
          dom.__mometa.findParents().forEach((data) => {
            if (data.dom) {
              const arr = paths.get(data.dom) || []
              arr.push(data)
              paths.set(data.dom, arr)
            }
          })

          setPaths(paths)
        }
      }}
    >
      <Button type="text" size={'small'} className={cn(c(), className)} icon={<MenuOutlined />} />
    </Dropdown>
  )
})

MoreButton.defaultProps = {}

export default MoreButton
