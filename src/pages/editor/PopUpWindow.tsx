import React, { useContext, useState } from "react"
import styled from "styled-components"
import { CurrentThemeContext, MenuState } from "./Editor"
import { useAppDispatch } from "../../app/hooks"
import { addImage } from "../../features/documents/documentsSlice"

const PopUpWindow = () => {
  const dispatch = useAppDispatch()
  const { popUpFor, setPopUpFor } = useContext(MenuState)

  const { main } = useContext(CurrentThemeContext)

  //new image functionality
  const [imgURL, setImgURL] = useState("")

  const handleNewImageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imgURL.trim() !== "") {
      dispatch(addImage({ src: imgURL }))
      setPopUpFor(null)
    }
  }

  const closePopUp = () => {
    setPopUpFor(null)
  }

  const PopUpContent = () => {
    if (popUpFor === "new_image") {
      return (
        <form onSubmit={handleNewImageSubmit}>
          <label>
            <p>Image URL:</p>
            <input
              type="url"
              className="image-url-input"
              autoFocus
              value={imgURL}
              onChange={(e) => setImgURL(e.target.value)}
            />
          </label>
          <div className="flex btns">
            <button type="submit">OK</button>
            <button onClick={closePopUp}>Cancel</button>
          </div>
        </form>
      )
    }
  }

  return (
    <StyledPopUpWindow>
      <div className="bg" />
      <div className="pop-up">
        <PopUpContent />
      </div>
    </StyledPopUpWindow>
  )
}

export default PopUpWindow

const StyledPopUpWindow = styled.article`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .bg {
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.5;
  }

  .pop-up {
    position: absolute;
    top: 200px;
    left: 40vw;
    padding: 24px;
    width: 400px;
    height: fit-content;
    background-color: white;
    border-radius: 12px;
  }

  .pop-up form {
    width: 92%;
  }

  .pop-up form .btns {
    margin: 4px 0 0;
    gap: 8px;
  }

  .pop-up form .btns button {
    padding: 4px;
    border-radius: 6px;
    border: none;
  }

  .image-url-input {
    width: 100%;
    padding: 2px 4px;
  }
`
