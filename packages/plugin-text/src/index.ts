import { defaultNode } from '@splish-me/editor-plugin-text-plugin'
import { TextPluginSerializedState } from '@splish-me/editor-plugin-text-renderer'
import { parseFragment } from 'parse5'
import { Value } from 'slate'
import Html from 'slate-html-serializer'

import { createTextEditor } from './editor'
import { TextPluginState, TextPluginOptions } from './types'

export const createTextPlugin = (options: TextPluginOptions) => {
  const createInitialState = (): TextPluginState => {
    return {
      editorState: Value.fromJSON({
        document: {
          nodes: [
            {
              object: 'block',
              type: defaultNode,
              nodes: [
                {
                  object: 'text',
                  leaves: [
                    {
                      text: ''
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
    }
  }

  const lineBreakSerializer = {
    // @ts-ignore
    deserialize(el) {
      if (el.tagName.toLowerCase() === 'br') {
        return { object: 'text', text: '\n' }
      }

      if (el.nodeName === '#text') {
        if (el.value && el.value.match(/<!--.*?-->/)) return
        if (el.value === '\n') return

        return {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: el.value
            }
          ]
        }
      }

      return undefined
    }
  }

  const html = new Html({
    rules: [lineBreakSerializer, ...options.plugins],
    defaultBlock: {
      type: defaultNode
    },
    parseHtml: (html: string) => parseFragment(html) as HTMLElement
  })

  return {
    text: 'Text',
    Component: createTextEditor(options),

    handleBlur: (props: {
      onChange: (state: TextPluginState) => void
      state: TextPluginState
    }) => {
      const { editorState } = props.state

      props.onChange({
        editorState: editorState
          .change()
          .deselect()
          .blur().value
      })
    },

    createInitialState,

    unserialize({
      importFromHtml,
      editorState
    }: TextPluginSerializedState): TextPluginState {
      if (editorState) {
        return { editorState: Value.fromJSON(editorState) }
      } else if (importFromHtml) {
        try {
          const editorState = html.deserialize(importFromHtml)

          return { editorState }
        } catch (e) {
          console.log('Failed on', importFromHtml, e)
          return createInitialState()
        }
      }

      return createInitialState()
    },

    serialize({ editorState }: TextPluginState): TextPluginSerializedState {
      return {
        editorState: editorState.toJSON()
      }
    }
  }
}
