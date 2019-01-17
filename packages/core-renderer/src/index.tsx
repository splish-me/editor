import { DocumentContext } from '@splish-me/editor-core-contexts'
import { DocumentProps, SerializedDocument } from '@splish-me/editor-core-types'
import { editable as editableReducer } from 'ory-editor-core/lib/reducer/editable'
import { PluginService } from 'ory-editor-core'
import * as R from 'ramda'
import * as React from 'react'
import { warn } from '@splish-me/shared'

export const createRenderer = <K extends string = string>({
  renderContainer,
  renderRow,
  renderCell
}: {
  renderContainer: (
    args: { cells: any; children: React.ReactNode }
  ) => React.ReactNode
  renderRow: (args: { row: any; children: React.ReactNode }) => React.ReactNode
  renderCell: (
    args: { cell: any; children: React.ReactNode }
  ) => React.ReactNode
}): React.ComponentType<RendererProps<K>> => {
  interface CellProps {
    rows: any[]
    content?: any
    size: number
  }

  class Cell extends React.Component<CellProps> {
    static defaultProps = {
      rows: [],
      content: {}
    }

    render() {
      const { rows, content } = this.props

      if (content.plugin) {
        const {
          state,
          plugin: { Component, StaticComponent }
        } = content
        const Renderer = StaticComponent || Component

        return renderCell({
          cell: this.props,
          children: (
            <Renderer
              isPreviewMode
              readOnly
              state={state}
              onChange={() => {}}
            />
          )
        })
      } else if (rows.length > 0) {
        return renderCell({
          cell: this.props,
          children: rows.map(row => {
            return (
              <React.Fragment key={row.id}>
                {renderRow({
                  row,
                  children: row.cells.map((cell: any) => (
                    <Cell key={cell.id} {...cell} />
                  ))
                })}
              </React.Fragment>
            )
          })
        })
      }

      return null
    }
  }

  return class Renderer extends React.Component<RendererProps<K>> {
    public render() {
      const { state } = this.props

      warn(
        !Array.isArray(this.props.plugins),
        'Passing plugins as array is deprecated and will be removed in the next minor version. Pass a dictionary instead.'
      )

      let plugins: any[]

      if (Array.isArray(this.props.plugins)) {
        plugins = this.props.plugins
      } else {
        plugins = R.compose(
          R.values,
          R.mapObjIndexed((plugin, name) => {
            warn(
              typeof plugin['name'] === 'undefined',
              'Specifying a plugin name is deprecated and will be removed in the next minor version. Use the dictionary key instead'
            )
            warn(
              typeof plugin['version'] === 'undefined',
              'Specifying the version of a plugin is deprecated and will be removed in the next minor version.'
            )

            return {
              ...plugin,
              name,
              // TODO: workaround until next minor version where we remove version handling completely
              version: plugin['version'] || '999.0.0'
            }
          })
        )(this.props.plugins)
      }

      const service: any = new PluginService({ content: plugins })
      const props = editableReducer(service.unserialize(state), {
        type: 'renderer/noop'
      })
      const cells: unknown[] = props.cells || []

      return (
        <DocumentContext.Provider
          value={({ state }: DocumentProps) => {
            const doc = state as SerializedDocument

            if (doc.state) {
              return <Renderer state={doc.state} plugins={plugins} />
            }

            throw new Error(
              'Got `DocumentIdentifier` instead of a `SerializedDocument`'
            )
          }}
        >
          {renderContainer({
            cells,
            children: cells.map((cell: any) => <Cell key={cell.id} {...cell} />)
          })}
        </DocumentContext.Provider>
      )
    }
  }
}

export type RendererProps<K extends string = string> = {
  state: unknown
} & (DeprecatedPluginRegistryProps | PluginRegistryProps<K>)

/**
 * @deprecated since version 0.4.6
 */
interface DeprecatedPluginRegistryProps {
  plugins: unknown[]
}

interface PluginRegistryProps<K extends string = string> {
  plugins: Record<K, unknown>
}
