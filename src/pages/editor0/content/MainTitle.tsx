import React, { useState, useCallback, useContext } from "react"
import styled from "styled-components"
import { useAppDispatch } from "../../../app/hooks"
import { renameDoc } from "../../../features/documents/documentsSlice"
import {
  useRemirror,
  Remirror,
  useHelpers,
  useKeymap,
  useCommands,
} from "@remirror/react"
import { CurrentDocContext } from "../Editor"

type props = {
  docTitle: string
  docId: number | null
}

const hooks = [
  () => {
    const { getText } = useHelpers()
    const { insertText } = useCommands()
    const dispatch = useAppDispatch()
    const { title } = useContext(CurrentDocContext)!

    const handleEnterPress = useCallback(
      ({ state }: { state: any }) => {
        const newTitle = getText(state)
        if (newTitle.trim() !== "") {
          dispatch(renameDoc({ newTitle }))
        } else {
          insertText(title)
        }
        return true
      },
      [getText, dispatch, title, insertText],
    )

    useKeymap("Enter", handleEnterPress)
  },
]

const MainTitle = ({ docTitle }: props) => {
  const t = React.useMemo(() => docTitle, [docTitle])

  const { manager, state } = useRemirror({
    content: t,
    stringHandler: "text",
  })

  // const { getText } = useHelpers()
  // const [newTitle, setNewTitle] = useState(docTitle)

  // const handleChange = (e: React.ChangeEvent) => {
  //   const { value } = e.target! as HTMLInputElement
  //   setNewTitle(value)
  // }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (newTitle.trim() !== "") {
  //     dispatch(renameDoc({ newTitle }))
  //   } else {
  //     setNewTitle(docTitle)
  //   }
  // }

  return (
    <StyledDocTitle>
      <Remirror
        manager={manager}
        initialContent={state}
        onChange={(params) => {
          const newTitle = params.helpers.getText()
          console.log(newTitle)
        }}
        hooks={hooks}
      />
    </StyledDocTitle>
  )

  // return (
  //   <StyledDocTitle>
  //     <form onSubmit={(e) => handleSubmit(e)}>
  //       <input
  //         value={newTitle}
  //         placeholder="Can't be empty"
  //         onChange={(e) => handleChange(e)}
  //       />
  //     </form>
  //   </StyledDocTitle>
  // )
  // return <StyledDocTitle onClick={handleModeChange}>{newTitle}</StyledDocTitle>
}

export default React.memo(MainTitle)

const StyledDocTitle = styled.h1`
  margin: 24px var(--editor-left-mg);
  border-bottom: 4px solid var(--main);
  font-family: "Roboto Condensed", sans-serif;
  font-size: var(--h1-size);
  font-weight: normal;

  //remirror
  white-space: pre-wrap;
  height: 1.2em;
  &:focus {
    outline: none;
  }

  input {
    width: 100%;
    font-family: "Roboto Condensed", sans-serif;
    font-size: var(--h1-size);
    border: none;
  }
`
