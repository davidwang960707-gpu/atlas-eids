import type { ReactNode } from 'react'
import { lightTheme } from '@atlas-eids/tokens'
import {
  Button,
  ConfigProvider,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tabs,
  type ButtonProps,
  type ConfigProviderProps,
  type DrawerProps,
  type FormProps,
  type InputProps,
  type ModalProps,
  type SelectProps,
  type TableProps,
  type TabsProps
} from 'antd'

export const atlasAntdTheme: NonNullable<ConfigProviderProps['theme']> = {
  token: {
    colorPrimary: lightTheme['color.action.primary'],
    colorInfo: lightTheme['color.status.info'],
    colorSuccess: lightTheme['color.status.success'],
    colorWarning: lightTheme['color.status.warning'],
    colorError: lightTheme['color.status.error'],
    colorText: lightTheme['color.text.primary'],
    colorTextSecondary: lightTheme['color.text.secondary'],
    colorBorder: lightTheme['color.border.default'],
    colorBgLayout: lightTheme['color.bg.canvas'],
    colorBgContainer: lightTheme['color.bg.surface'],
    borderRadius: Number.parseFloat(lightTheme['radius.control']),
    borderRadiusLG: 8,
    controlHeight: 32,
    fontSize: 14
  },
  components: {
    Button: { primaryShadow: 'none', fontWeight: 500 },
    Table: { headerBg: lightTheme['color.bg.subtle'], headerColor: lightTheme['color.text.secondary'], rowHoverBg: lightTheme['color.action.soft'] },
    Modal: { borderRadiusLG: 8 },
    Drawer: { colorBgElevated: lightTheme['color.bg.elevated'] }
  }
}

export function AtlasAntdProvider({ children, theme }: { children: ReactNode; theme?: ConfigProviderProps['theme'] }) {
  return <ConfigProvider theme={{ ...atlasAntdTheme, ...theme, token: { ...atlasAntdTheme.token, ...theme?.token } }}>{children}</ConfigProvider>
}

export interface AtlasAntdButtonProps extends Omit<ButtonProps, 'type' | 'danger'> {
  intent?: 'neutral' | 'primary' | 'danger'
}

export function AtlasAntdButton({ intent = 'neutral', ...props }: AtlasAntdButtonProps) {
  return <Button type={intent === 'primary' ? 'primary' : 'default'} danger={intent === 'danger'} {...props}/>
}

export const AtlasAntdInput = (props: InputProps) => <Input {...props}/>
export const AtlasAntdSelect = (props: SelectProps) => <Select {...props}/>
export const AtlasAntdTable = <Row extends object>(props: TableProps<Row>) => <Table<Row> size="middle" {...props}/>
export const AtlasAntdModal = (props: ModalProps) => <Modal centered {...props}/>
export const AtlasAntdDrawer = (props: DrawerProps) => <Drawer width={420} {...props}/>
export const AtlasAntdTabs = (props: TabsProps) => <Tabs size="middle" {...props}/>
export type AtlasAntdFormProps = Omit<FormProps, 'children'> & { children?: ReactNode }
export const AtlasAntdForm = (props: AtlasAntdFormProps) => <Form layout="vertical" requiredMark="optional" {...props}/>

export { Button as AntButton, Input as AntInput, Select as AntSelect, Table as AntTable, Modal as AntModal, Drawer as AntDrawer, Tabs as AntTabs, Form as AntForm }
