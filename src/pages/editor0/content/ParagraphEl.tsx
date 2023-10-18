import React from "react"
import StyledContent from "./StyledContent"
import { ParagraphElement } from "../../../types"
import { Remirror, useRemirror } from "@remirror/react"

type props = {
  paragraphElement: ParagraphElement
}

const ParagraphEl = ({ paragraphElement }: props) => {
  const { content } = paragraphElement

  const { manager, state } = useRemirror({
    content,
    stringHandler: "text",
  })

  return (
    <StyledContent style={{ margin: "auto 0" }}>
      <Remirror manager={manager} initialContent={state} />
    </StyledContent>
  )
}

export default React.memo(ParagraphEl)
