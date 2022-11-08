import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

//import action
import { editSpotPair } from '../../actions/tradePairAction'

// import lib
import { toastAlert } from '../../lib/toastAlert';


const options = [{ 'value': "binance", 'label': "binance" }, { 'value': "off", 'label': "Off" }, { 'value': "wazirx", 'label': "Wazirx" }];
const statusOptions = [{ 'value': "active", 'label': "Active" }, { 'value': "deactive", 'label': "DeActive" }]

const initialFormValue = {
    "pairId": "",
    "firstCurrencyId": " ",
    "firstFloatDigit": "",
    "secondCurrencyId": " ",
    "secondFloatDigit": "",
    "minPricePercentage": "",
    "maxPricePercentage": "",
    "minQuantity": "",
    "maxQuantity": "",
    "maker_rebate": "",
    "taker_fees": "",
    "markPrice": "",
    "markupPercentage": "",
    "botstatus": "off",
    "status": "active", //active ,deactive
}

class PairAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        const { record } = nextProps;
        console.log("🚀 ~ file: PairUpdateModal.js ~ line 44 ~ PairAddModal ~ componentWillReceiveProps ~ record", record)

        if (record) {
            this.setState({
                formValue: {
                    'pairId': record._id,
                    "firstCurrencyId": record.firstCurrencyId,
                    "firstFloatDigit": record.firstFloatDigit,
                    "secondCurrencyId": record.secondCurrencyId,
                    "secondFloatDigit": record.secondFloatDigit,
                    "minPricePercentage": record.minPricePercentage,
                    "maxPricePercentage": record.maxPricePercentage,
                    "minQuantity": record.minQuantity,
                    "maxQuantity": record.maxQuantity,
                    "maker_rebate": record.maker_rebate,
                    "taker_fees": record.taker_fees,
                    "markPrice": record.markPrice,
                    "markupPercentage": record.markupPercentage,
                    "botstatus": record.botstatus,
                    "status": record.status,
                }
            })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let { name, id, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [id]: value } };
        this.setState({ formValue: formData });
        if (value) {
            this.setState({ errors: {} });
        }
    };

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, errors: {} });

    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { formValue } = this.state;
            const { fetchData } = this.props;
            let reqData = formValue;
            let { status, loading, result, error, message } = await editSpotPair(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addTemplate');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'addSpotPair');
            }
        }
        catch (err) { }
    }

    render() {
        const { errors, } = this.state;
        const {
            markupPercentage,
            maker_rebate,
            taker_fees,
            markPrice,
            minPricePercentage,
            maxPricePercentage,
            maxQuantity,
            minQuantity,
            firstCurrencyId,
            firstFloatDigit,
            secondCurrencyId,
            secondFloatDigit,
            botstatus,
            status
        } = this.state.formValue
        const { isShow, currencyOptions } = this.props;

        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    size="lg"
                    centered
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Update Spot</h4>
                    </Modal.Header>
                    <Modal.Body>

                        <form noValidate id="add-spot">

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Base Currency </label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'firstCurrencyId'}
                                        id={'firstCurrencyId'}
                                        value={firstCurrencyId}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Select Base Currency"}</option>
                                        {
                                            currencyOptions && currencyOptions.length > 0 && currencyOptions.map((item, key) => {
                                                return (
                                                    <option key={key} value={item.value}>{item.label}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.firstCurrencyId}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Base Currency Decimal</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={firstFloatDigit}
                                        name="firstFloatDigit"
                                        error={errors.firstFloatDigit}
                                        id="firstFloatDigit"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.firstFloatDigit
                                        })}
                                    />
                                    <span className="text-danger">{errors.firstFloatDigit}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Quotes Currency </label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'secondCurrencyId'}
                                        id={'secondCurrencyId'}
                                        value={secondCurrencyId}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Select Qoute Currency"}</option>
                                        {
                                            currencyOptions && currencyOptions.length > 0 && currencyOptions.map((item, key) => {
                                                return (
                                                    <option key={key} value={item.value}>{item.label}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.secondCurrencyId}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Quotes Currency Decimal</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={secondFloatDigit}
                                        name="secondFloatDigit"
                                        error={errors.secondFloatDigit}
                                        id="secondFloatDigit"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.secondFloatDigit
                                        })}
                                    />
                                    <span className="text-danger">{errors.secondFloatDigit}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="maker_rebate">Maker Fee(%)</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={maker_rebate}
                                        name="maker_rebate"
                                        error={errors.maker_rebate}
                                        id="maker_rebate"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.maker_rebate
                                        })}
                                    />
                                    <span className="text-danger">{errors.maker_rebate}</span>
                                </div>
                            </div>


                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Taker Fee(%)</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={taker_fees}
                                        name="taker_fees"
                                        error={errors.taker_fees}
                                        id="taker_fees"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.taker_fees
                                        })}
                                    />
                                    <span className="text-danger">{errors.taker_fees}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Minimum Price(%)</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={minPricePercentage}
                                        name="minPricePercentage"
                                        error={errors.minPricePercentage}
                                        id="minPricePercentage"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.minPricePercentage
                                        })}
                                    />
                                    <span className="text-danger">{errors.minPricePercentage}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Maximum Price(%)</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={maxPricePercentage}
                                        name="maxPricePercentage"
                                        error={errors.maxPricePercentage}
                                        id="maxPricePercentage"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.maxPricePercentage
                                        })}
                                    />
                                    <span className="text-danger">{errors.maxPricePercentage}</span>
                                </div>
                            </div>



                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="minQuantity">Minimum Quantity</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={minQuantity}
                                        name="minQuantity"
                                        error={errors.minQuantity}
                                        id="minQuantity"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.minQuantity
                                        })}
                                    />
                                    <span className="text-danger">{errors.minQuantity}</span>
                                </div>
                            </div>


                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="maxQuantity">Maximum Quantity</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={maxQuantity}
                                        name="maxQuantity"
                                        error={errors.maxQuantity}
                                        id="maxQuantity"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.maxQuantity
                                        })}
                                    />
                                    <span className="text-danger">{errors.maxQuantity}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="maxQuantity"> MarkPrice</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={markPrice}
                                        name="markPrice"
                                        error={errors.markPrice}
                                        id="markPrice"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.markPrice
                                        })}
                                    />
                                    <span className="text-danger">{errors.markPrice}</span>
                                </div>
                            </div>
                            {
                                botstatus == 'binance' &&
                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label>Markup(%)</label>
                                    </div>
                                    <div className="col-md-9">

                                        <input
                                            onChange={this.handleChange}
                                            value={markupPercentage}
                                            name="maxQuantity"
                                            error={errors.markupPercentage}
                                            id="markupPercentage"
                                            type="text"
                                            className={classnames("form-control", {
                                                invalid: errors.markupPercentage
                                            })}
                                        />


                                        <span className="text-danger">{errors.markupPercentage}</span>
                                    </div>
                                </div>
                            }

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="autobot">Binance Integration</label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'botstatus'}
                                        id={'botstatus'}
                                        value={botstatus}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Bot Status"}</option>
                                        {
                                            options && options.length > 0 && options.map((item, key) => {
                                                return (
                                                    <option key={key} value={item.value}>{item.label}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.botstatus}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="autobot">Status</label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'status'}
                                        id={'status'}
                                        value={status}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Status"}</option>
                                        {
                                            statusOptions && statusOptions.length > 0 && statusOptions.map((item, key) => {
                                                return (
                                                    <option key={key} value={item.value}>{item.label}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
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


export default PairAddModal;
