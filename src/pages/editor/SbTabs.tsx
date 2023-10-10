import React from "react"
import styled from "styled-components"
import AddComponentsMenu from "./sidebarMenus/AddComponentsMenu"
export type sbTabOption = "Doc" | "Project" | "Add..." | "Style..."
type props = {
  options: [sbTabOption, sbTabOption]
  activeIdx: 0 | 1
  setActiveIdx: (newIdx: 0 | 1) => void
}

const SbTabs = ({ options, activeIdx, setActiveIdx }: props) => {
  const [firstOption, secondOption] = options

  const handleClick = (newActiveIdx: 0 | 1) => {
    if (newActiveIdx !== activeIdx) {
      setActiveIdx(newActiveIdx)
    }
  }

  const SbMenu = () => {
    const activeOption = options[activeIdx]
    switch (activeOption) {
      case "Add...":
        return <AddComponentsMenu />
      default:
        return <span>Sb Menu</span>
    }
  }
  return (
    <StyledTabs>
      <div className="options flex">
        <button
          className={activeIdx === 0 ? "active-btn" : ""}
          onClick={() => handleClick(0)}
        >
          {firstOption}
        </button>
        <button
          className={activeIdx === 1 ? "active-btn" : ""}
          onClick={() => handleClick(1)}
        >
          {secondOption}
        </button>
      </div>
      <SbMenu />
    </StyledTabs>
  )
}

export default SbTabs

const StyledTabs = styled.section`
  display: flex;
  flex-direction: column;

  .options {
    display: flex;
    border-bottom: 2px solid var(--main);
    min-height: calc(1.2 * var(--h4-size));
  }

  button {
    width: 80px;
    flex-grow: 1;
    background: none;
    border: none;
    font-size: var(--h4-size);
    color: var(--main);
  }

  .active-btn {
    font-weight: bold;
  }
`
