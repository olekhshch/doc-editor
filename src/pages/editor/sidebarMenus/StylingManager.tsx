import React from "react"
import styled from "styled-components"
import usePersist from "../../../app/usePersist"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import StylingTemplatesList from "../../root/StylingTemplatesList"
import { StylingTemplate } from "../../../features/styling/initialState"
import { saveActiveStylingAsTemplate } from "../../../features/styling/stylingSlice"

const StylingManager = () => {
  const dispatch = useAppDispatch()
  const { templates } = useAppSelector((state) => state.styling)

  return (
    <StyledManager>
      <div>
        <p>Save current styling template:</p>
        <button
          className="btn"
          onClick={() => dispatch(saveActiveStylingAsTemplate())}
        >
          to local storage
        </button>
        <button className="btn">to JSON</button>
        {templates.length > 0 && <StylingTemplatesList templates={templates} />}
      </div>
    </StyledManager>
  )
}

export default StylingManager

const StyledManager = styled.section`
  margin-top: 24px;
  color: black;
`
