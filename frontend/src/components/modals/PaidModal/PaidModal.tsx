import { useAuthState } from "../../../context/authentication"
import { User } from "../../../reducers/authentication"

interface ModalProps {
  title: string
  id: number
  closeModal: () => any
  submitModal: (id: number) => any
}

const PaidModal = ({ title, id, submitModal, closeModal }: ModalProps) => {
  const user: User | any = useAuthState().user

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
            <p className="info-text">
              Da li ste sigurni da želite da nastavite?
            </p>
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
              onClick={() => submitModal(id)}
            >
              Potvrdi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaidModal
