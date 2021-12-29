const { resolveLibMatConfig } = require('@mometa/materials-generator')

module.exports = [
  resolveLibMatConfig('antd'),
  {
    name: 'My Antd',
    key: 'my-antd',
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
            homepage: 'https://ant.design/components/typography-cn/',
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
          {
            name: '栅格',
            key: 'grid',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/5rWLU27so/Grid.svg',
            homepage: 'https://ant.design/components/grid-cn/',
            data: {
              code: `<$Row$>
      <$Col$ span={12}>col-12</$Col$>
      <$Col$ span={12}>col-12</$Col$>
    </$Row$>`,
              dependencies: {
                Row: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Row'
                },
                Col: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Col'
                }
              }
            }
          },
          {
            name: '布局',
            key: 'layout',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/hzEndUVEx/Layout.svg',
            homepage: 'https://ant.design/components/layout-cn/',
            data: {
              code: `<$Layout$>
      <$Layout$.Header>Header</$Layout$.Header>
      <$Layout$>
        <$Layout$.Sider>Sider</$Layout$.Sider>
        <$Layout$.Content>Content</$Layout$.Content>
      </$Layout$>
      <$Layout$.Footer>Footer</$Layout$.Footer>
    </$Layout$>`,
              dependencies: {
                Layout: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Layout'
                }
              }
            }
          },
          {
            name: '间距',
            key: 'space',
            homepage: 'https://ant.design/components/space-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/wc6%263gJ0Y8/Space.svg',
            data: {
              code: `<$Space$>
                <span>span1</span><span>span2</span>
              </$Space$>`,
              dependencies: {
                Space: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Space'
                }
              }
            }
          }
        ]
      },
      {
        name: '导航',
        key: 'nav',
        assets: [
          {
            name: '固钉',
            key: 'affix',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/tX6-md4H6/Affix.svg',
            homepage: 'https://ant.design/components/affix-cn/',
            data: {
              code: `<$Affix$ offsetTop={120}>
    <div>120px to affix top</div>
  </$Affix$>`,
              dependencies: {
                Affix: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Affix'
                }
              }
            }
          },
          {
            name: '面包屑',
            key: 'Breadcrumb',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/9Ltop8JwH/Breadcrumb.svg',
            homepage: 'https://ant.design/components/breadcrumb-cn/',
            data: {
              code: `<$Breadcrumb$>
    <$Breadcrumb$.Item>Home</$Breadcrumb$.Item>
    <$Breadcrumb$.Item>
      <a href="">Application Center</a>
    </$Breadcrumb$.Item>
    <$Breadcrumb$.Item>
      <a href="">Application List</a>
    </$Breadcrumb$.Item>
    <$Breadcrumb$.Item>An Application</$Breadcrumb$.Item>
  </$Breadcrumb$>`,
              dependencies: {
                Breadcrumb: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Breadcrumb'
                }
              }
            }
          },
          {
            name: '下拉',
            key: 'dropdown',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/eedWN59yJ/Dropdown.svg',
            homepage: 'https://ant.design/components/dropdown-cn/',
            data: {
              code: `<$Dropdown$ overlay={<$Menu$>
    <$Menu$.Item>
      <a>
        1st Menu item
      </a>
    </$Menu$.Item>
    <$Menu$.Item>
      <a>
        2nd Menu item
      </a>
    </$Menu$.Item>
    <$Menu$.Item>
      <a>
        3rd Menu item
      </a>
    </$Menu$.Item>
  </$Menu$>}>
    <a>
      Hover me
    </a>
  </$Dropdown$>`,
              dependencies: {
                Dropdown: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Dropdown'
                },
                Menu: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Menu'
                }
              }
            }
          },
          {
            name: '导航菜单',
            key: 'Menu',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/3XZcjGpvK/Menu.svg',
            homepage: 'https://ant.design/components/menu-cn/',
            data: {
              code: `<$Menu$>
    <$Menu$.Item>
      <a>
        1st Menu item
      </a>
    </$Menu$.Item>
    <$Menu$.Item>
      <a>
        2nd Menu item
      </a>
    </$Menu$.Item>
    <$Menu$.Item>
      <a>
        3rd Menu item
      </a>
    </$Menu$.Item>
  </$Menu$>`,
              dependencies: {
                Menu: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Menu'
                }
              }
            }
          },
          {
            name: '分页',
            key: 'Pagination',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/1vqv2bj68/Pagination.svg',
            homepage: 'https://ant.design/components/pagination-cn/',
            data: {
              code: `<$Pagination$ defaultCurrent={1} total={50} />`,
              dependencies: {
                Pagination: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Pagination'
                }
              }
            }
          },
          {
            name: '页头',
            key: 'PageHeader',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/6bKE0Cq0R/PageHeader.svg',
            homepage: 'https://ant.design/components/pagination-cn/',
            data: {
              code: `<$PageHeader$
    className="site-page-header"
    onBack={() => null}
    title="Title"
    subTitle="This is a subtitle"
  />`,
              dependencies: {
                PageHeader: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'PageHeader'
                }
              }
            }
          },
          {
            name: '步骤条',
            key: 'Steps',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/UZYqMizXHaj/Steps.svg',
            homepage: 'https://ant.design/components/steps-cn/',
            data: {
              code: `<$Steps$ current={1}>
    <$Steps$.Step title="Finished" description="This is a description." />
    <$Steps$.Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
    <$Steps$.Step title="Waiting" description="This is a description." />
  </$Steps$>`,
              dependencies: {
                Steps: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Steps'
                }
              }
            }
          }
        ]
      },
      {
        name: '数据录入',
        key: 'data-input',
        assets: [
          {
            name: '自动完成',
            key: 'AutoComplete',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/qtJm4yt45/AutoComplete.svg',
            homepage: 'https://ant.design/components/auto-complete-cn/',
            data: {
              code: `<$AutoComplete$
        options={[]}
        placeholder="input here"
      />`,
              dependencies: {
                AutoComplete: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'AutoComplete'
                }
              }
            }
          },
          {
            name: '多选框',
            key: 'CheckBox',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/8nbVbHEm_/CheckBox.svg',
            homepage: 'https://ant.design/components/checkbox-cn/',
            data: {
              code: `<$Checkbox$>Checkbox</$Checkbox$>`,
              dependencies: {
                Checkbox: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Checkbox'
                }
              }
            }
          },
          {
            name: '级联选择',
            key: 'cascader',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/UdS8y8xyZ/Cascader.svg',
            homepage: 'https://ant.design/components/cascader-cn/',
            data: {
              code: `<$Cascader$ options={[
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]} placeholder="Please select" />`,
              dependencies: {
                Cascader: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Cascader'
                }
              }
            }
          },
          {
            name: '日期选择框',
            key: 'DatePicker',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/RT_USzA48/DatePicker.svg',
            homepage: 'https://ant.design/components/date-picker-cn/',
            data: {
              code: `<$DatePicker$ />`,
              dependencies: {
                DatePicker: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'DatePicker'
                }
              }
            }
          },
          {
            name: '菜单',
            key: 'Form',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/ORmcdeaoO/Form.svg',
            homepage: 'https://ant.design/components/form-cn/',
            data: {
              code: `<$Form$ name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                <$Form$.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <$Input$ />
      </$Form$.Item>
      <$Form$.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <$Input$ />
      </$Form$.Item>
              </$Form$>`,
              dependencies: {
                Form: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Form'
                },
                Input: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Input'
                }
              }
            }
          },
          {
            name: '数字输入框',
            key: 'InputNumber',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/XOS8qZ0kU/InputNumber.svg',
            homepage: 'https://ant.design/components/input-number-cn/',
            data: {
              code: `<$InputNumber$ min={1} max={10} defaultValue={1} />`,
              dependencies: {
                InputNumber: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'InputNumber'
                }
              }
            }
          },
          {
            name: '输入框',
            key: 'Input',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
            homepage: 'https://ant.design/components/input-cn/',
            data: {
              code: `<$Input$ placeholder={'请输入'} />`,
              dependencies: {
                Input: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Input'
                }
              }
            }
          },
          {
            name: '提及',
            key: 'Mentions',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/jPE-itMFM/Mentions.svg',
            homepage: 'https://ant.design/components/mentions-cn/',
            data: {
              code: `<$Mentions$ defaultValue="@afc163" >
                <$Mentions$.Option value="afc163">afc163</$Mentions$.Option>
                <$Mentions$.Option value="zombieJ">zombieJ</$Mentions$.Option>
              </$Mentions$>`,
              dependencies: {
                Mentions: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Mentions'
                }
              }
            }
          },
          {
            name: '评分',
            key: 'Rate',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/R5uiIWmxe/Rate.svg',
            homepage: 'https://ant.design/components/rate-cn/',
            data: {
              code: `<$Rate$ allowHalf defaultValue={2.5} />`,
              dependencies: {
                Rate: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Rate'
                }
              }
            }
          },
          {
            name: '单选框',
            key: 'Radio',
            homepage: 'https://ant.design/components/radio-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/8cYb5seNB/Radio.svg',
            data: {
              code: '<$Radio$>单选</$Radio$>',
              dependencies: {
                Radio: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Radio'
                }
              }
            }
          },
          {
            name: '开关',
            key: 'Switch',
            homepage: 'https://ant.design/components/switch-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/zNdJQMhfm/Switch.svg',
            data: {
              code: '<$Switch$ />',
              dependencies: {
                Switch: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Switch'
                }
              }
            }
          },
          {
            name: '滑动输入条',
            key: 'Slider',
            homepage: 'https://ant.design/components/slider-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/HZ3meFc6W/Silder.svg',
            data: {
              code: '<$Slider$ />',
              dependencies: {
                Slider: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Slider'
                }
              }
            }
          },
          {
            name: '选择器',
            key: 'Select',
            homepage: 'https://ant.design/components/select-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/_0XzgOis7/Select.svg',
            data: {
              code: `<$Select$ defaultValue="lucy" style={{ width: 120 }}>
              <$Select$.Option value="jack">Jack</$Select$.Option>
      <$Select$.Option value="lucy">Lucy</$Select$.Option>
      <$Select$.Option value="disabled" disabled>
        Disabled
      </$Select$.Option>
              </$Select$>`,
              dependencies: {
                Select: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Select'
                }
              }
            }
          },
          {
            name: '树选择',
            key: 'TreeSelect',
            homepage: 'https://ant.design/components/tree-select-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/Ax4DA0njr/TreeSelect.svg',
            data: {
              code: `<$TreeSelect$ showSearch dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}>
              <$TreeSelect$.TreeNode value="parent 1" title="parent 1">
        <$TreeSelect$.TreeNode value="parent 1-0" title="parent 1-0">
          <$TreeSelect$.TreeNode value="leaf1" title="leaf1" />
          <$TreeSelect$.TreeNode value="leaf2" title="leaf2" />
        </$TreeSelect$.TreeNode>
        <$TreeSelect$.TreeNode value="parent 1-1" title="parent 1-1">
          <$TreeSelect$.TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
        </$TreeSelect$.TreeNode>
      </$TreeSelect$.TreeNode>
              </$TreeSelect$>`,
              dependencies: {
                TreeSelect: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'TreeSelect'
                }
              }
            }
          },
          {
            name: '穿梭框',
            key: 'Transfer',
            homepage: 'https://ant.design/components/transfer-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/QAXskNI4G/Transfer.svg',
            data: {
              code: '<$Transfer$ />',
              dependencies: {
                Transfer: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Transfer'
                }
              }
            }
          },
          {
            name: '时间选择框',
            key: 'TimePicker',
            homepage: 'https://ant.design/components/time-picker-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/h04Zsl98I/TimePicker.svg',
            data: {
              code: '<$TimePicker$ />',
              dependencies: {
                TimePicker: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'TimePicker'
                }
              }
            }
          },
          {
            name: '上传',
            key: 'Upload',
            homepage: 'https://ant.design/components/upload-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/QaeBt_ZMg/Upload.svg',
            data: {
              code: '<$Upload$ ><span>点击上传</span><$Upload$>',
              dependencies: {
                Upload: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Upload'
                }
              }
            }
          }
        ]
      },
      {
        name: '数据展示',
        key: '数据展示',
        assets: [
          {
            name: '头像',
            key: 'Avatar',
            homepage: 'https://ant.design/components/avatar-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/aBcnbw68hP/Avatar.svg',
            data: {
              code: '<$Avatar$ size={40} src="https://joeschmoe.io/api/v1/random" />',
              dependencies: {
                Avatar: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Avatar'
                }
              }
            }
          },
          {
            name: '徽标数',
            key: 'Badge',
            homepage: 'https://ant.design/components/badge-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/6%26GF9WHwvY/Badge.svg',
            data: {
              code: '<$Badge$ count={5}><span>Badge</span></$Badge$>',
              dependencies: {
                Badge: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Badge'
                }
              }
            }
          },
          {
            name: '评论',
            key: 'Comment',
            homepage: 'https://ant.design/components/comment-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/ILhxpGzBO/Comment.svg',
            data: {
              code: '<$Comment$ author={<span>imcuttle</span>}  />',
              dependencies: {
                Comment: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Comment'
                }
              }
            }
          },
          {
            name: '折叠面板',
            key: 'Collapse',
            homepage: 'https://ant.design/components/collapse-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/IxH16B9RD/Collapse.svg',
            data: {
              code: `<$Collapse$ defaultActiveKey={['1']} >
                <$Collapse$.Panel header="This is panel header 1" key="1">
                  <p>hello world</p>
                </$Collapse$.Panel>
                <$Collapse$.Panel header="This is panel header 2" key="2">
                  <p>hello world</p>
                </$Collapse$.Panel>
              </$Collapse$>`,
              dependencies: {
                Collapse: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Collapse'
                }
              }
            }
          },
          {
            name: '走马灯',
            key: 'Carousel',
            homepage: 'https://ant.design/components/carousel-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/%24C9tmj978R/Carousel.svg',
            data: {
              code: `<$Carousel$>
              <div>
              <h3 >1</h3>
            </div>
            <div>
              <h3 >2</h3>
            </div></$Carousel$>`,
              dependencies: {
                Carousel: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Carousel'
                }
              }
            }
          },
          {
            name: '卡片',
            key: 'Card',
            homepage: 'https://ant.design/components/card-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/NqXt8DJhky/Card.svg',
            data: {
              code: '<$Card$ style={{ width: 300 }} ><p>content</p></Card>',
              dependencies: {
                Card: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Card'
                }
              }
            }
          },
          {
            name: '日历',
            key: 'Calendar',
            homepage: 'https://ant.design/components/calendar-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/dPQmLq08DI/Calendar.svg',
            data: {
              code: '<$Calendar$ />',
              dependencies: {
                Calendar: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Calendar'
                }
              }
            }
          },
          {
            name: '描述列表',
            key: 'Descriptions',
            homepage: 'https://ant.design/components/descriptions-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/MjtG9_FOI/Descriptions.svg',
            data: {
              code: `<$Descriptions$ title="User Info" >
              <$Descriptions$.Item label="UserName">Zhou Maomao</$Descriptions$.Item>
              <$Descriptions$.Item label="Telephone">1810000000</$Descriptions$.Item>
              <$Descriptions$.Item label="Live">Hangzhou, Zhejiang</$Descriptions$.Item>
              <$Descriptions$.Item label="Remark">empty</$Descriptions$.Item>
              <$Descriptions$.Item label="Address">
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </$Descriptions$.Item>
              </$Descriptions$>`,
              dependencies: {
                Descriptions: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Descriptions'
                }
              }
            }
          },
          {
            name: '空状态',
            key: 'Empty',
            homepage: 'https://ant.design/components/empty-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/MNbKfLBVb/Empty.svg',
            data: {
              code: '<$Empty$ />',
              dependencies: {
                Empty: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Empty'
                }
              }
            }
          },
          {
            name: '图片',
            key: 'Image',
            homepage: 'https://ant.design/components/image-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/D1dXz9PZqa/image.svg',
            data: {
              code: `<$Image$ width={200} src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />`,
              dependencies: {
                Image: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Image'
                }
              }
            }
          },
          {
            name: '列表',
            key: 'List',
            homepage: 'https://ant.design/components/list-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/5FrZKStG_/List.svg',
            data: {
              code: `<$List$
              size="small"
              header={<div>Header</div>}
              footer={<div>Footer</div>}
              bordered
              dataSource={[
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
]}
              renderItem={item => <$List$.Item>{item}</$List$.Item>}
              />`,
              dependencies: {
                List: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'List'
                }
              }
            }
          },
          {
            name: '气泡卡片',
            key: 'Popover',
            homepage: 'https://ant.design/components/popover-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/1PNL1p_cO/Popover.svg',
            data: {
              code: `<$Popover$ title="Title" content={<div>
    <p>Content</p>
    <p>Content</p>
  </div>} ><span>Hover me</span></$Popover$>`,
              dependencies: {
                Popover: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Popover'
                }
              }
            }
          },
          {
            name: '统计数值',
            key: 'Statistic',
            homepage: 'https://ant.design/components/statistic-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/rcBNhLBrKbE/Statistic.svg',
            data: {
              code: '<$Statistic$ title="Active Users" value={112893} />',
              dependencies: {
                Statistic: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Statistic'
                }
              }
            }
          },
          {
            name: '树形控件',
            key: 'Tree',
            homepage: 'https://ant.design/components/tree-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/Xh-oWqg9k/Tree.svg',
            data: {
              code: `<$Tree$
              checkable
              defaultExpandedKeys={['0-0-0', '0-0-1']}
              defaultSelectedKeys={['0-0-0', '0-0-1']}
              defaultCheckedKeys={['0-0-0', '0-0-1']}
              treeData={[
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
]}
              />`,
              dependencies: {
                Tree: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Tree'
                }
              }
            }
          },
          {
            name: '文字提示',
            key: 'Tooltip',
            homepage: 'https://ant.design/components/tooltip-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/Vyyeu8jq2/Tooltp.svg',
            data: {
              code: '<$Tooltip$ title="prompt text"><span>Tooltip will show on mouse enter.</span></$Tooltip$>',
              dependencies: {
                Tooltip: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Tooltip'
                }
              }
            }
          },
          {
            name: '时间轴',
            key: 'Timeline',
            homepage: 'https://ant.design/components/timeline-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/vJmo00mmgR/Timeline.svg',
            data: {
              code: `<$Timeline$>
              <$Timeline$.Item>Create a services site 2015-09-01</$Timeline$.Item>
    <$Timeline$.Item>Solve initial network problems 2015-09-01</$Timeline$.Item>
    <$Timeline$.Item>Technical testing 2015-09-01</$Timeline$.Item>
    <$Timeline$.Item>Network problems being solved 2015-09-01</$Timeline$.Item>
              </$Timeline$>`,
              dependencies: {
                Timeline: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Timeline'
                }
              }
            }
          },
          {
            name: '标签',
            key: 'Tag',
            homepage: 'https://ant.design/components/tag-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/cH1BOLfxC/Tag.svg',
            data: {
              code: '<$Tag$>Tag</$Tag$>',
              dependencies: {
                Tag: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Tag'
                }
              }
            }
          },
          {
            name: '标签页',
            key: 'Tabs',
            homepage: 'https://ant.design/components/tabs-cn/',
            cover: 'https://gw.alipayobjects.com/zos/antfincdn/lkI2hNEDr2V/Tabs.svg',
            data: {
              code: `<$Tabs$ >
              <$Tabs$.TabPane tab="Tab 1" key="1">
                Tab Pane 1
              </$Tabs$.TabPane>
              <$Tabs$.TabPane tab="Tab 2" key="2">
                Tab Pane 2
              </$Tabs$.TabPane>
              </$Tabs$>`,
              dependencies: {
                Tabs: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Tabs'
                }
              }
            }
          },
          {
            name: '表格',
            key: 'Table',
            homepage: 'https://ant.design/components/table-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/f-SbcX2Lx/Table.svg',
            data: {
              code: `<$Table$ dataSource={[
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]} columns={[
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]} />`,
              dependencies: {
                Table: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Table'
                }
              }
            }
          }
        ]
      },
      {
        name: '反馈',
        key: '反馈',
        assets: [
          {
            name: '警告提示',
            key: 'Alert',
            homepage: 'https://ant.design/components/alert-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/8emPa3fjl/Alert.svg',
            data: {
              code: '<$Alert$ message="Success Text" type="success" />',
              dependencies: {
                Alert: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Alert'
                }
              }
            }
          },
          {
            name: '抽屉',
            key: 'Drawer',
            homepage: 'https://ant.design/components/drawer-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/7z8NJQhFb/Drawer.svg',
            data: {
              code: `<$Drawer$ title="Basic Drawer" placement="right" >
              <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
              </$Drawer$>`,
              dependencies: {
                Drawer: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Drawer'
                },
                Button: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                }
              }
            }
          },
          {
            name: '对话框',
            key: 'Modal',
            homepage: 'https://ant.design/components/modal-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/3StSdUlSH/Modal.svg',
            data: {
              code: `
              <$Button$ type="primary" onClick={() => {
              $Modal$.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    okText: '确认',
    cancelText: '取消',
  });
              }}>
        Open Modal
      </$Button$>
              `,
              dependencies: {
                Modal: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Modal'
                },
                Button: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                }
              }
            }
          },
          {
            name: '全局提示',
            key: 'Message',
            homepage: 'https://ant.design/components/message-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/hAkKTIW0K/Message.svg',
            data: {
              code: `<$Button$ onClick={() => { $message$.info('消息...') }}>点击提示</$Button$>`,
              dependencies: {
                message: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'message'
                },
                Button: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                }
              }
            }
          },
          {
            name: '通知提醒框',
            key: 'Notification',
            homepage: 'https://ant.design/components/notification-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/Jxm5nw61w/Notification.svg',
            data: {
              code: `<$Button$ onClick={() => { $notification$.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  }) }}>点击提示</$Button$>`,
              dependencies: {
                notification: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'notification'
                },
                Button: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                }
              }
            }
          },
          {
            name: '进度条',
            key: 'Progress',
            homepage: 'https://ant.design/components/progress-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/xqsDu4ZyR/Progress.svg',
            data: {
              code: '<$Progress$ percent={30} />',
              dependencies: {
                Progress: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Progress'
                }
              }
            }
          },
          {
            name: '气泡确认框',
            key: 'Popconfirm',
            homepage: 'https://ant.design/components/popconfirm-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/fjMCD9xRq/Popconfirm.svg',
            data: {
              code: '<$Popconfirm$ title="是否确认删除？"><a>删除</a></$Popconfirm$>',
              dependencies: {
                Popconfirm: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Popconfirm'
                }
              }
            }
          },
          {
            name: '结果',
            key: 'Result',
            homepage: 'https://ant.design/components/result-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/9nepwjaLa/Result.svg',
            data: {
              code: '<$Result$ status="403" title="403" subTitle="无权限" />',
              dependencies: {
                Result: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Result'
                }
              }
            }
          },
          {
            name: '加载中',
            key: 'Spin',
            homepage: 'https://ant.design/components/spin-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/LBcJqCPRv/Spin.svg',
            data: {
              code: '<$Spin$ />',
              dependencies: {
                Spin: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Spin'
                }
              }
            }
          },
          {
            name: '骨架屏',
            key: 'Skeleton',
            homepage: 'https://ant.design/components/skeleton-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/KpcciCJgv/Skeleton.svg',
            data: {
              code: '<$Skeleton$ />',
              dependencies: {
                Skeleton: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Skeleton'
                }
              }
            }
          }
        ]
      },
      {
        name: '其他',
        key: '其他',
        assets: [
          {
            name: '锚点',
            key: 'Anchor',
            homepage: 'https://ant.design/components/anchor-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/_1-C1JwsC/Anchor.svg',
            data: {
              code: `<$Anchor$>
              <$Anchor$.Link href="#components-anchor-demo-basic" title="Basic demo" />
    <$Anchor$.Link href="#components-anchor-demo-static" title="Static demo" />
    <$Anchor$.Link href="#API" title="API">
      <$Anchor$.Link href="#Anchor-Props" title="Anchor Props" />
      <$Anchor$.Link href="#Link-Props" title="Link Props" />
    </$Anchor$.Link>
              </$Anchor$>`,
              dependencies: {
                Anchor: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Anchor'
                }
              }
            }
          },
          {
            name: '回到顶部',
            key: 'BackTop',
            homepage: 'https://ant.design/components/back-top-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/tJZ5jbTwX/BackTop.svg',
            data: {
              code: '<$BackTop$ />',
              dependencies: {
                BackTop: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'BackTop'
                }
              }
            }
          },
          {
            name: '全局化配置',
            key: 'ConfigProvider',
            homepage: 'https://ant.design/components/config-provider-cn/',
            cover: 'https://gw.alipayobjects.com/zos/alicdn/kegYxl1wj/ConfigProvider.svg',
            data: {
              code: '<$ConfigProvider$ >全局化配置</$ConfigProvider$>',
              dependencies: {
                ConfigProvider: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'ConfigProvider'
                }
              }
            }
          }
        ]
      }
    ]
  }
].concat([
  {
    name: '物料2',
    key: '2',
    assetGroups: []
  },
  {
    name: '物料3',
    key: '3'
  },
  {
    name: '物料4',
    key: '4'
  },
  {
    name: '物料5',
    key: '5'
  }
])
