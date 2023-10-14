import React from "react"
import { HeadingElement } from "../../../types"
import StyledContent from "./StyledContent"
import StyledElementToolbar from "./StyledElementToolbar"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setHeadingLevel } from "../../../features/documents/documentsSlice"

const HeadingEl = ({ content, level, id, orderIdx }: HeadingElement) => {
  const dispatch = useAppDispatch()
  const { currentElementId } = useAppSelector((state) => state.documents)

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
      <>
        <section className="toolbar-section" title="Change heading level">
          {headingLevels.map((l) => (
            <button
              key={l}
              className={
                isActive(l)
                  ? "element-toolbar-btn active"
                  : "element-toolbar-btn"
              }
              onClick={() => setNewLevel(l)}
              disabled={isActive(l)}
            >
              {l}
            </button>
          ))}
        </section>
        <section className="toolbar-section">{id}</section>
      </>
    )
  }
  return (
    <StyledContent>
      <StyledElementToolbar>
        <Toolbar />
      </StyledElementToolbar>
      <Heading level={level} title={content} />
    </StyledContent>
  )
}

export default HeadingEl

type props0 = {
  level: 1 | 2 | 3
  title: string
}
const Heading = ({ level, title }: props0) => {
  switch (level) {
    case 1:
      return <h2>{title}</h2>
    case 2:
      return <h3>{title}</h3>
    default:
      return <h4>{title}</h4>
  }
}
