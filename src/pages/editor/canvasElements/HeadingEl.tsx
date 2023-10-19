import React, { useMemo, useCallback } from "react"
import { HeadingElement } from "../../../types"
import { useAppDispatch } from "../../../app/hooks"
import {
  setActiveElementId,
  setHeadingContent,
  setHeadingLevel,
} from "../../../features/documents/documentsSlice"
import StyledElementToolbar from "./StyledElementToolbar"
import { Remirror, useRemirror, useHelpers, useKeymap } from "@remirror/react"

const hooks = [
  () => {
    const { getText } = useHelpers()
    const dispatch = useAppDispatch()

    const handleEnterPress = useCallback(
      (state: any) => {
        const newContent = getText(state)
        dispatch(setHeadingContent({ newContent }))
        return true
      },
      [getText, dispatch],
    )

    useKeymap("Enter", handleEnterPress)
  },
]
type props = {
  headingElementObj: HeadingElement
}

const HeadingEl = ({ headingElementObj }: props) => {
  const dispatch = useAppDispatch()
  const { _id, level, content } = headingElementObj
  console.log(`HEADING ${_id} has rendered`)

  const Toolbar = () => {
    type headingLevel = 1 | 2 | 3
    const levels: headingLevel[] = [1, 2, 3]

    const isActive = (l: headingLevel) => {
      return l === level
    }

    const handleLevelChange = (e: React.MouseEvent, l: headingLevel) => {
      e.stopPropagation()
      if (!isActive(l)) {
        dispatch(setHeadingLevel({ newLevel: l, headingElId: _id }))
      }
    }

    return (
      <StyledElementToolbar>
        <div className="toolbar-section">
          {levels.map((l) => (
            <button
              className={
                isActive(l)
                  ? "element-toolbar-btn active"
                  : "element-toolbar-btn"
              }
              title="Change heading level"
              onClick={(e) => handleLevelChange(e, l)}
              key={l}
            >
              {l}
            </button>
          ))}
        </div>
      </StyledElementToolbar>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(setActiveElementId(_id))
  }

  const { manager, state } = useRemirror({
    content,
    stringHandler: "text",
  })

  const HeadingMemo = useMemo(() => {
    if (level === 1) {
      return (
        <h2 spellCheck="false">
          <Remirror manager={manager} initialContent={state} hooks={hooks} />
        </h2>
      )
    }

    if (level === 2) {
      return (
        <h3 spellCheck="false">
          <Remirror manager={manager} initialContent={state} hooks={hooks} />
        </h3>
      )
    }

    return (
      <h4 spellCheck="false">
        <Remirror manager={manager} initialContent={state} hooks={hooks} />
      </h4>
    )
  }, [level, manager, state])

  return (
    <div onClick={(e) => handleClick(e)}>
      <Toolbar />
      {HeadingMemo}
    </div>
  )
}

export default React.memo(HeadingEl)
