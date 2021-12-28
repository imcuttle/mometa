module.exports = [
  {
    name: 'Antd',
    key: 'component',
    assetGroups: [
      {
        name: '通用',
        key: 'general',
        assets: [
          {
            name: '按钮',
            key: 'Button',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/fNUKzY1sk/Button.svg',
            homepage: 'https://ant.design/components/button-cn/',
            data: {
              code: '<$ANT_BUTTON$ type="default">按钮</$ANT_BUTTON$>',
              dependencies: {
                ANT_BUTTON: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                }
              }
            }
          },
          // {
          //   name: '图标',
          //   key: 'icon',
          //   cover: 'https://gw.alipayobjects.com/zos/alicdn/rrwbSt3FQ/Icon.svg',
          //   homepage: 'https://ant.design/components/icon-cn/',
          //   data: {
          //     code: '<$ANT_BUTTON$ type="default">按钮</$ANT_BUTTON$>',
          //     dependencies: {
          //       ANT_BUTTON: {
          //         source: 'antd',
          //         mode: 'named',
          //         imported: 'Button'
          //       }
          //     }
          //   }
          // },
          {
            name: '排版',
            key: 'typo',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/GOM1KQ24O/Typography.svg',
            data: {
              code: '<$Typography$.Title>标题</$Typography$.Title>',
              dependencies: {
                Typography: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Typography'
                }
              }
            }
          }
        ]
      },
      {
        name: '布局',
        key: 'layout',
        assets: [
          {
            name: '分割线',
            key: 'div',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/5swjECahe/Divider.svg',
            homepage: 'https://ant.design/components/divider-cn/',
            data: {
              code: '<$Divider$ />',
              dependencies: {
                Divider: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Divider'
                }
              }
            }
          },
          // {
          //   name: '图标',
          //   key: 'icon',
          //   cover: 'https://gw.alipayobjects.com/zos/alicdn/rrwbSt3FQ/Icon.svg',
          //   homepage: 'https://ant.design/components/icon-cn/',
          //   data: {
          //     code: '<$ANT_BUTTON$ type="default">按钮</$ANT_BUTTON$>',
          //     dependencies: {
          //       ANT_BUTTON: {
          //         source: 'antd',
          //         mode: 'named',
          //         imported: 'Button'
          //       }
          //     }
          //   }
          // },
          {
            name: '排版',
            key: 'typo',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/GOM1KQ24O/Typography.svg',
            data: {
              code: '<$Typography$.Title>标题</$Typography$.Title>',
              dependencies: {
                Typography: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Typography'
                }
              }
            }
          }
        ]
      }
    ]
  }
]
