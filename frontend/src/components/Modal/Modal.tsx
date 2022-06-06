import React from "react"
import { useAuthState } from "../../context/authentication"

interface ModalProps {
  modal: {}
  closeModal: () => any
  submitModal: () => any
}

const Modal = ({ modal, closeModal, submitModal }: ModalProps) => {
  const user = useAuthState()

  return (
    <div
      className="modal fade show"
      id="exampleModal"
      style={{ display: "block" }}
      aria-labelledby="exampleModalLabel"
      aria-hidden="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => closeModal()}
            ></button>
          </div>
          {user.token ? (
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
          ) : (
            <div>Login</div>
          )}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => closeModal()}
            >
              Otkaži
            </button>
            {user.token ? (
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
