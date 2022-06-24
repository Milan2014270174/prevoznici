import React, { useState } from "react"
import "./new-company-modal.css"

interface ModalProps {
  title: string
  closeModal: () => any
  submitModal: (params: string) => any
}

const NewCompanyModal = ({ title, closeModal, submitModal }: ModalProps) => {
  const [name, setName] = useState("")
  const [success, setSuccess] = useState(false)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  function submit() {
    if (name && name.length > 0) {
      submitModal(name)
    }
  }

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
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => closeModal()}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-5">
              <div className="search-column mb-2 col-6">
                <label htmlFor="companies">Naziv prevoznika</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Unesite naziv kompanije"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => closeModal()}
              >
                Otkaži
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
              >
                Potvrdi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewCompanyModal
