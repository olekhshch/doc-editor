import React, { useContext } from "react"
import styled from "styled-components"
import { CurrentThemeContext } from "../pages/editor/Editor"
import { IoIosLink } from "react-icons/io"

type props = {
  title: string
  colour?: string
  isMain?: boolean

  onClick: React.MouseEventHandler
}

const AppButton = ({ title, onClick, colour, isMain }: props) => {
  const main = colour ?? "var(--main)"

  return (
    <StyledBtn onClick={onClick} $main_colour={main} $isMain={isMain}>
      {title}
    </StyledBtn>
  )
}

export default AppButton

type styledProps = {
  $main_colour: string
  $isMain?: boolean
}

const StyledBtn = styled.button<styledProps>`
  transition: 0.2s;
  background-color: ${(pr) => (pr.$isMain ? pr.$main_colour : "transparent")};

  font-size: 0.9em;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid ${(pr) => pr.$main_colour};
  color: ${(pr) => (pr.$isMain ? pr.$main_colour : "white")};
  width: fit-content;
  user-select: none;
  cursor: pointer;

  color: ${(pr) => (pr.$isMain ? "white" : pr.$main_colour)};

  &&:hover {
    color: ${(pr) => (pr.$isMain ? pr.$main_colour : "white")};
    background-color: "transparent";
  }

  &&:hover {
    background-color: ${(pr) => (pr.$isMain ? "white" : pr.$main_colour)};
  }
`
