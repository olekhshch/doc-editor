import React, { useContext, useCallback, useMemo } from "react"
import { HeadingElement } from "../../../types"
import StyledContent from "./StyledContent"
import StyledElementToolbar from "./StyledElementToolbar"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  setActiveElementId,
  setHeadingLevel,
} from "../../../features/documents/documentsSlice"
import {
  Remirror,
  useRemirror,
  useHelpers,
  useCommands,
  useKeymap,
} from "@remirror/react"
import { CurrentDocContext } from "../Editor"

const hooks = [
  () => {
    const { getText } = useHelpers()
    const { insertText } = useCommands()
    const dispatch = useAppDispatch()
    const { title } = useContext(CurrentDocContext)!

    const handleEnterPress = useCallback(
      ({ state }: { state: any }) => {
        const newHeadingContent = getText(state)
        // if (newTitle.trim() !== "") {
        //   dispatch(renameDoc({ newTitle }))
        // } else {
        //   insertText(title)
        // }
        return true
      },
      [getText, dispatch, title, insertText],
    )

    useKeymap("Enter", handleEnterPress)
  },
]

const HeadingEl = ({ content, level, id, orderIdx }: HeadingElement) => {
  const dispatch = useAppDispatch()

  const { manager, state } = useRemirror({
    content,
    stringHandler: "text",
  })

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(setActiveElementId(id))
  }

  const Toolbar = () => {
    //Levels section
    type headingLvl = 1 | 2 | 3
    const headingLevels: headingLvl[] = [1, 2, 3]
    const isActive = (l: headingLvl) => {
      return l === level
    }

    const setNewLevel = (newLevel: 1 | 2 | 3) => {
      dispatch(setHeadingLevel({ newLevel, headingElId: id }))
    }

    return (
      <section className="toolbar-section" title="Change heading level">
        {headingLevels.map((l) => (
          <button
            key={l}
            className={
              isActive(l) ? "element-toolbar-btn active" : "element-toolbar-btn"
            }
            onClick={() => setNewLevel(l)}
            disabled={isActive(l)}
          >
            {l}
          </button>
        ))}
      </section>
    )
  }

  return (
    <StyledContent onClick={(e) => handleClick(e)}>
      <StyledElementToolbar>
        <Toolbar />
      </StyledElementToolbar>
      <Heading level={level} title={content}>
        <Remirror
          manager={manager}
          initialContent={state}
          hooks={hooks}
        ></Remirror>
      </Heading>
    </StyledContent>
  )
}

export default React.memo(HeadingEl)

type props0 = {
  level: 1 | 2 | 3
  title: string
  children: JSX.Element
}

const Heading = ({ level, title, children }: props0) => {
  switch (level) {
    case 1:
      return <h2>{children}</h2>
    case 2:
      return <h3>{children}</h3>
    default:
      return <h4>{children}</h4>
  }
}
