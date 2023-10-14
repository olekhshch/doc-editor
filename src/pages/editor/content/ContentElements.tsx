import React, { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import HeadingEl from "./HeadingEl"
import styled from "styled-components"
import { DocContentComponent, HeadingElement } from "../../../types"
import { MdOutlineDragIndicator } from "react-icons/md"

const ContentElements = () => {
  const { activeContent } = useAppSelector((state) => state.documents)

  const components = useMemo(() => {
    console.log("COMPONENTS CHANGED [MEMO]")
    return activeContent.components
  }, [activeContent.components])

  const Content = (element: DocContentComponent) => {
    const { type } = element
    if (type === "heading") {
      const headingElement = element as HeadingElement
      return <HeadingEl {...headingElement} />
    }

    return <>Element Component</>
  }

  return (
    <StyledElementContainer className="flex">
      <div className="flex-col">
        {components.map((docElement) => {
          return (
            <div
              className="flex one-element"
              key={Math.round(Math.random() * 1243333343)}
            >
              <div className="doc-element-left">
                <div>
                  <button className="dnd-handle">
                    {" "}
                    <MdOutlineDragIndicator />{" "}
                  </button>
                </div>
              </div>
              <Content {...docElement} />
            </div>
          )
        })}
      </div>
    </StyledElementContainer>
  )
}

export default ContentElements

const StyledElementContainer = styled.article`
  margin: 32px 0%;
  width: 100%;

  .doc-element-left {
    min-width: var(--editor-left-mg);
    text-align: right;
  }

  .dnd-handle {
    margin: 12px 2px;
    padding: 0;
    width: fit-content;
    height: 1em;
    font-size: 32px;
    background: none;
    border: none;
    color: transparent;
    cursor: grabbing;
  }
  .one-element:hover .dnd-handle {
    color: grey;
  }

  .one-element:hover .dnd-handle:hover {
    color: var(--main);
  }
`
