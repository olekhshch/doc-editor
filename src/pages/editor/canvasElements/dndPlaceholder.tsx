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

  const [collect, dropRef] = useDrop<DragElementItem, void, DropCollected>({
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

  if (collect.isStart) {
    return <StyledPlaceholder ref={dropRef}>{indexBefore}</StyledPlaceholder>
  }

  return <></>
}

export default DnDPlaceholder

const StyledPlaceholder = styled.div`
  height: 4px;
  background-color: var(--main);
  /* opacity: 0;

  &:hover {
    opacity: 1;
  } */
`
