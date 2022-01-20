import React from 'react'
import p from 'prefix-classname'
import { Input, Modal } from 'antd'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}-add-material-dialog`)

export interface AddMaterialDialogProps {
  className?: string
  visible?: boolean
}

const AddMaterialDialog: React.FC<AddMaterialDialogProps> = React.memo(({ visible, className }) => {
  return (
    <Modal className={cn(c(), className)} footer={null} visible={visible} closable={false}>
      <Input.Search placeholder={'输入外部物料，如 antd'} />
    </Modal>
  )
})

AddMaterialDialog.defaultProps = {}

export default AddMaterialDialog
