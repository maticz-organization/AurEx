import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import action
import { faqCategoryAdd } from '../../actions/faqActions';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'name': '',
}

class AddFaqCategoryModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
        };
    }

    handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, 'errors': {} });
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { fetchData } = this.props;
            const { formValue } = this.state;
            let reqData = formValue;
            const { status, loading, message, error } = await faqCategoryAdd(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addFaqCategory')
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'addFaqCategory')
            }
        } catch (err) { }
    }

    render() {
        const { errors } = this.state;
        const { name } = this.state.formValue
        const { isShow } = this.props;
console.log(errors,'................')
        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    size="md"
                    centered
                // scrollable={true}
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Add Faq Category</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate onSubmit={this.handleSubmit} id="add-faq">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="question">Category Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={name}
                                        name="name"
                                        type="text"
                                        error={errors.name}
                                        className={classnames("form-control", {
                                            invalid: errors.name
                                        })} />
                                    <span className="text-danger">{errors.name}</span>
                                </div>
                            </div>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.handleClose}
                        >
                            Close
                        </button>
                        <button
                            onClick={this.handleSubmit}
                            type="submit"
                            className="btn btn-primary"
                        >
                            Submit
                        </button>

                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default AddFaqCategoryModal;