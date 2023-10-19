import React from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
import { DnDTypes } from "../../../DnDtypes"
import { useAppDispatch } from "../../../app/hooks"
import { moveElement } from "../../../features/documents/documentsSlice"

type props = {
  indexBefore: number
}

type DragElementItem = {
  _id: number
}

type DropCollected = {
  isOver: boolean
  isStart: boolean
}

const DnDPlaceholder = ({ indexBefore }: props) => {
  const dispatch = useAppDispatch()

  const [{ isStart }, dropRef] = useDrop<DragElementItem, void, DropCollected>({
    accept: DnDTypes.ELEMENT,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isStart: monitor.canDrop(),
    }),
    drop: (item) => {
      dispatch(
        moveElement({ elementId: item._id, newPlacementIdx: indexBefore }),
      )
    },
  })

  return (
    <StyledPlaceholder ref={dropRef} $canDrop={isStart}></StyledPlaceholder>
  )
}

export default DnDPlaceholder

type StyledProps = {
  $canDrop: boolean
}

const StyledPlaceholder = styled.div<StyledProps>`
  height: 4px;
  background-color: var(--main);
  opacity: ${(props) => (props.$canDrop ? 1 : 0)};
`
