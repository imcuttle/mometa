import React from 'react'
import p from 'prefix-classname'
import { NodeIndexOutlined, MenuOutlined } from '@ant-design/icons'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import { Dropdown, Menu, Typography } from 'antd'
import { uniqBy } from 'lodash-es'
import { MometaHTMLElement } from '../../dom-api'
import { useSelectedNode, api } from '@@__mometa-external/shared'

const cn = p('')
const c = p(`${CLS_PREFIX}-more-button`)

export interface MoreButtonProps {
  className?: string
  dom: MometaHTMLElement
}

const MoreButton: React.FC<MoreButtonProps> = React.memo(({ className, dom }) => {
  const [, setSelectedNode] = useSelectedNode()
  const [paths, setPaths] = React.useState([])

  return (
    <Dropdown
      className={c('__dropdown')}
      onVisibleChange={(v) => {
        if (v && !paths.length) {
          const key = dom.__mometa.getKey()
          setPaths(
            uniqBy(dom.__mometa.findParents({ includeSelf: false }), (x) => x.__mometa.getKey()).filter(
              (x) => x.__mometa.getKey() !== key
            )
          )
        }
      }}
      overlay={
        <Menu>
          <Menu.SubMenu title={'选中层级'} popupOffset={[0, 0]}>
            {paths.map((node, i) => {
              const data = node.__mometa.getMometaData()
              const isActive = dom.__mometa.getKey() === node.__mometa.getKey()
              return (
                <Menu.Item
                  key={node.__mometa.getKey()}
                  className={c({ '-active': isActive })}
                  disabled={isActive}
                  onClick={() => {
                    setSelectedNode(node)
                  }}
                >
                  {isActive ? <Typography.Link>{data.name}</Typography.Link> : <span>{data.name}</span>}
                </Menu.Item>
              )
            })}
          </Menu.SubMenu>
          <Menu.Item
            onClick={() => {
              setSelectedNode(null)
            }}
          >
            取消选中
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            onClick={() => {
              return api.handleViewOp('copy', dom)
            }}
          >
            重复一份
          </Menu.Item>
        </Menu>
      }
    >
      <MenuOutlined className={cn(c(), className)} />
    </Dropdown>
  )
})

MoreButton.defaultProps = {}

export default MoreButton
