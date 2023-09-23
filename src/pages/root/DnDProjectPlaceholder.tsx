import { type } from "os"
import React from "react"
import { useDrop } from "react-dnd"
import { DnDTypes } from "../../DnDtypes"
import { useAppDispatch } from "../../app/hooks"
import { moveProject } from "../../features/projects/projectsSlice"
import styled from "styled-components"

type props = { placementIndex: number }

interface DragProjectItem {
  _id: number
  title: string
  orderIndex: number
}

interface DropCollected {
  isOver: boolean
  isStart: boolean
}

const DnDProjectPlaceholder = ({ placementIndex }: props) => {
  const dispatch = useAppDispatch()
  const [collected, dropPlaceholder] = useDrop<
    DragProjectItem,
    void,
    DropCollected
  >(() => ({
    accept: DnDTypes.PROJECT,
    drop: (item) => {
      dispatch(
        moveProject({
          elementToMoveId: item._id,
          newPlacementIndex: placementIndex,
        }),
      )
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isStart: monitor.canDrop(),
    }),
  }))

  if (collected.isStart) {
    return (
      <StyledProjectPlaceholder ref={dropPlaceholder}>
        <div
          title="Insert here"
          className={
            !collected.isOver
              ? "project-placeholder drag-start"
              : "project-placeholder dragging"
          }
        ></div>
      </StyledProjectPlaceholder>
    )
  }

  return (
    <StyledProjectPlaceholder ref={dropPlaceholder}>
      <div className="project-placeholder"></div>
    </StyledProjectPlaceholder>
  )
}

export default DnDProjectPlaceholder

const StyledProjectPlaceholder = styled.div`
  padding: 4px 0;

  .project-placeholder {
    height: 2px;
    width: 100%;
  }

  .drag-start {
    background-color: var(--black);
    opacity: 0.6;
  }

  .dragging {
    background-color: var(--white);
  }
`
