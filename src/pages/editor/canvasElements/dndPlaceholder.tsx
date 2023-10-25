import React from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
import { DnDTypes } from "../../../DnDtypes"
import { useAppDispatch } from "../../../app/hooks"
import { moveElement } from "../../../features/documents/documentsSlice"

type props = {
  indexBefore: number
  columnTarget: null | [number, "left" | "right"]
}

type DragElementItem = {
  _id: number
  columnSource: null | [number, "left" | "right"]
}

type DropCollected = {
  isOver: boolean
  isStart: boolean
}

const DnDPlaceholder = ({ indexBefore, columnTarget }: props) => {
  const dispatch = useAppDispatch()

  const [{ isStart, isOver }, dropRef] = useDrop<
    DragElementItem,
    void,
    DropCollected
  >({
    accept: DnDTypes.ELEMENT,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isStart: monitor.canDrop(),
    }),
    drop: (item) => {
      dispatch(
        moveElement({
          elementId: item._id,
          newPlacementIdx: indexBefore,
          columnSource: item.columnSource,
          columnTarget,
        }),
      )
    },
  })

  return (
    <StyledPlaceholder
      ref={dropRef}
      $canDrop={isStart}
      $isOver={isOver}
    ></StyledPlaceholder>
  )
}

export default DnDPlaceholder

type StyledProps = {
  $canDrop: boolean
  $isOver: boolean
}

const StyledPlaceholder = styled.div<StyledProps>`
  height: ${(props) => (props.$canDrop ? "4px" : "2px")};
  background-color: var(--main);
  opacity: ${(props) => (props.$isOver ? 1 : 0)};
`
