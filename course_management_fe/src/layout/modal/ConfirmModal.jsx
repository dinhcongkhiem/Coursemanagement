
import './ConfirmModal.css'

export default function ConfirmModal({ onClose,  handleClickDelete}) {
    return (
        <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this course?</p>
            <div className="react-confirm-alert-button-group">
                <button onClick={onClose}>No</button>
                <button
                    onClick={() => {
                        handleClickDelete();
                        onClose();
                    }}
                >
                    Yes
                </button>
            </div>

        </div>
    )
}