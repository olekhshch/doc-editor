import React, { useContext } from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
import { DnDTypes } from "../../../DnDtypes"
import { useAppDispatch } from "../../../app/hooks"
import { moveElement } from "../../../features/documents/documentsSlice"
import { CurrentThemeContext } from "../Editor"
import { columnParam } from "../../../types"

type props = {
  indexBefore: number
  columnTarget: columnParam
}

type DragElementItem = {
  _id: number
  columnSource: columnParam
  idx: number
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
      if (item.idx !== indexBefore)
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

  //Styling
  const { gray, main } = useContext(CurrentThemeContext)
  return (
    <StyledPlaceholder
      ref={dropRef}
      $canDrop={isStart}
      $isOver={isOver}
      $gray={gray}
      $main={main}
    ></StyledPlaceholder>
  )
}

export default DnDPlaceholder

type StyledProps = {
  $canDrop: boolean
  $isOver: boolean
  $gray: string
  $main: string
}

const StyledPlaceholder = styled.div<StyledProps>`
  height: ${(props) => (props.$canDrop ? "4px" : "2px")};
  background-color: ${(props) => (props.$isOver ? props.$main : props.$gray)};
  opacity: ${(props) => (props.$canDrop ? 1 : 0)};
`
