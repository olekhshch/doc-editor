import React from "react"
import styled from "styled-components"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import { createNewDoc } from "../../features/documents/documentsSlice"

const Root = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigate()

  const handleNewDocCreation = () => {
    dispatch(createNewDoc())
    navigation("/docs")
  }

  return (
    <StyledRoot>
      <section id="root-main-panel">
        <canvas id="canvas-bg" height={1200} width={600} />
        <article id="panel-content">
          <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
            <span>Create</span>
            <span>a</span>
            <button className="main-btn" onClick={handleNewDocCreation}>
              {" "}
              New doc{" "}
            </button>
            <span> or </span>
            <button className="main-btn"> Load from file</button>
          </div>
        </article>
      </section>
    </StyledRoot>
  )
}

export default Root

const StyledRoot = styled.main`
  width: 100vw;
  height: 100vh;
  background-color: var(--main);
  display: flex;
  color: white;

  #root-main-panel {
    margin: auto;
    position: relative;
    /* border: 1px solid black; */
    border-radius: 8px;
    height: fit-content;
    max-height: 90vh;
    width: fit-content;
    max-width: 60vw;
    overflow: hidden;
  }

  #panel-content {
    position: absolute;
    top: 36px;
    width: 100%;
    /* background-color: blue; */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #canvas-bg {
    margin: 0;
    background-color: rgba(198, 118, 236, 1);
  }

  .main-btn {
    padding: 8px 12px;
    border: 1px solid var(--main-light);
    border-radius: 4px;
    background-color: var(--main);
    color: white;
  }
`
