module.exports = require('../../app/mometa-material.config').concat([
  {
    name: 'HHHPAC',
    key: 'component'
  },
  {
    name: 'Local Mat',
    key: 'local-mat',
    assetGroups: [
      {
        name: '通用',
        key: 'gen',
        assets: [
          {
            name: '按钮',
            key: 'Button',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/fNUKzY1sk/Button.svg',
            data: {
              code: '<Button type="default">按钮</Button>',
              dependencies: {
                Button: {
                  source: '@/materials/button',
                  mode: 'default'
                }
              }
            }
          }
        ]
      }
    ]
  }
])
