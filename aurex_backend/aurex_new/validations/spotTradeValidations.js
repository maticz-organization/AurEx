// import package
import mongoose from 'mongoose';

// import lib
import isEmpty from '../../lib/isEmpty';

/**
 * Order Place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY :  token
*/
export const decryptValidate = (req, res, next) => {
    let api_key = req.header("x-api-key");
    let authorization = req.header('Authorization');
    if (api_key !== null && api_key !== undefined && authorization == undefined) {
        return next();
    }
    else {
        let errors = {}, reqBody = req.body;

        if (isEmpty(reqBody.token)) {
            errors.token = "REQUIRED";
        }

        if (!isEmpty(errors)) {
            return res.status(400).json({'statusCode':400, "errors": errors })
        }
        return next();
    }
}

/**
 * Order Place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY :  orderType(limit,market,stopLimit,oco)
*/
export const orderPlaceValidate = (req, res, next) => {

    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.orderType)) {
        errors.orderType = "REQUIRED";
    } else if (!['limit', 'market', 'stop_limit', 'stop_market', 'trailing_stop'].includes(reqBody.orderType)) {
        errors.orderType = "INVALID_ORDER_TYPE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({'statusCode':400, "errors": errors })
    }

    if (reqBody.orderType == 'limit') {
        limitOrderValidate(req, res, next)
    } else if (reqBody.orderType == 'market') {
        marketOrderValidate(req, res, next)
    } else if (reqBody.orderType == 'stop_limit') {
        stopLimitOrderValidate(req, res, next)
    } else if (reqBody.orderType == 'stop_market') {
        stopMarketOrderValidate(req, res, next)
    } else if (reqBody.orderType == 'trailing_stop') {
        trailingStopOrderValidate(req, res, next)
    }
}

/**
 * Limit order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, price, quantity, buyorsell
*/
export const limitOrderValidate = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.spotPairId)) {
        errors.spotPairId = "REQUIRED";
    } else if (!mongoose.Types.ObjectId.isValid(reqBody.spotPairId)) {
        errors.spotPairId = "Invalid pair";
    }

    if (isEmpty(reqBody.price)) {
        errors.price = "REQUIRED";
    } else if (isNaN(reqBody.price)) {
        errors.price = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.price) < 0) {
        errors.price = "ALLOW_POSITIVE_NUMERIC";
    }

    if (isEmpty(reqBody.quantity)) {
        errors.quantity = "REQUIRED";
    } else if (isNaN(reqBody.quantity)) {
        errors.quantity = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.quantity) < 0) {
        errors.quantity = "ALLOW POSITIVE NUMERIC";
    }

    if (isEmpty(reqBody.buyorsell)) {
        errors.buyorsell = "REQUIRED";
    } else if (!['buy', 'sell'].includes(reqBody.buyorsell)) {
        errors.buyorsell = "INVALID SIDE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({'statusCode':400, "errors": errors })
    }

    return next();
}

/**
 * Market order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, quantity, buyorsell
*/
export const marketOrderValidate = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.spotPairId)) {
        errors.spotPairId = "REQUIRED";
    } else if (!mongoose.Types.ObjectId.isValid(reqBody.spotPairId)) {
        errors.spotPairId = "Invalid pair";
    }

    if (isEmpty(reqBody.quantity)) {
        errors.quantity = "REQUIRED";
    } else if (isNaN(reqBody.quantity)) {
        errors.quantity = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.quantity) < 0) {
        errors.quantity = "ALLOW POSITIVE NUMERIC";
    }

    if (isEmpty(reqBody.buyorsell)) {
        errors.buyorsell = "REQUIRED";
    } else if (!['buy', 'sell'].includes(reqBody.buyorsell)) {
        errors.buyorsell = "INVALID SIDE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ 'statusCode':400,"errors": errors })
    }

    return next();
}

/**
 * Stop Limit order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, stopPrice, price, quantity, buyorsell, orderType, newdate
*/
export const stopLimitOrderValidate = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.spotPairId)) {
        errors.spotPairId = "REQUIRED";
    } else if (!mongoose.Types.ObjectId.isValid(reqBody.spotPairId)) {
        errors.spotPairId = "Invalid pair";
    }

    if (isEmpty(reqBody.stopPrice)) {
        errors.stopPrice = "REQUIRED";
    } else if (isNaN(reqBody.stopPrice)) {
        errors.stopPrice = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.stopPrice) <=0) {
        errors.stopPrice = "ALLOW_POSITIVE_NUMERIC";
    }

    if (isEmpty(reqBody.price)) {
        errors.price = "REQUIRED";
    } else if (isNaN(reqBody.price)) {
        errors.price = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.price) < 0) {
        errors.price = "ALLOW_POSITIVE_NUMERIC";
    }

    if (isEmpty(reqBody.quantity)) {
        errors.quantity = "REQUIRED";
    } else if (isNaN(reqBody.quantity)) {
        errors.quantity = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.quantity) <= 0) {
        errors.quantity = "ALLOW POSITIVE NUMERIC";
    }

    if (isEmpty(reqBody.buyorsell)) {
        errors.buyorsell = "REQUIRED";
    } else if (!['buy', 'sell'].includes(reqBody.buyorsell)) {
        errors.buyorsell = "INVALID SIDE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({'statusCode':400, "errors": errors })
    }

    return next();
}

/**
 * Stop Market order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, stopPrice, quantity, buyorsell, orderType, 
*/
export const stopMarketOrderValidate = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.spotPairId)) {
        errors.spotPairId = "REQUIRED";
    } else if (!mongoose.Types.ObjectId.isValid(reqBody.spotPairId)) {
        errors.spotPairId = "Invalid pair";
    }

    if (isEmpty(reqBody.stopPrice)) {
        errors.stopPrice = "REQUIRED";
    } else if (isNaN(reqBody.stopPrice)) {
        errors.stopPrice = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.stopPrice) <= 0) {
        errors.stopPrice = "ALLOW_POSITIVE_NUMERIC";
    }

    if (isEmpty(reqBody.quantity)) {
        errors.quantity = "REQUIRED";
    } else if (isNaN(reqBody.quantity)) {
        errors.quantity = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.quantity) <= 0) {
        errors.quantity = "ALLOW POSITIVE NUMERIC";
    }

    if (isEmpty(reqBody.buyorsell)) {
        errors.buyorsell = "REQUIRED";
    } else if (!['buy', 'sell'].includes(reqBody.buyorsell)) {
        errors.buyorsell = "INVALID SIDE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({'statusCode':400, "errors": errors })
    }

    return next();
}

/**
 * Trailing Stop order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, distance, quantity, buyorsell, orderType, 
*/
export const trailingStopOrderValidate = (req, res, next) => {
    let errors = {}, reqBody = req.body;
    if (isEmpty(reqBody.spotPairId)) {
        errors.spotPairId = "REQUIRED";
    } else if (!mongoose.Types.ObjectId.isValid(reqBody.spotPairId)) {
        errors.spotPairId = "Invalid pair";
    }

    if (isEmpty(reqBody.distance)) {
        errors.distance = "REQUIRED";
    } else if (isNaN(reqBody.distance)) {
        errors.distance = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.distance) <= 0) {
        errors.distance = "ALLOW_POSITIVE_NUMERIC";
    }

    if (isEmpty(reqBody.quantity)) {
        errors.quantity = "REQUIRED";
    } else if (isNaN(reqBody.quantity)) {
        errors.quantity = "ALLOW_NUMERIC";
    } else if (parseFloat(reqBody.quantity) <= 0) {
        errors.quantity = "ALLOW_POSITIVE_NUMERIC";
    }

    if (isEmpty(reqBody.buyorsell)) {
        errors.buyorsell = "REQUIRED";
    } else if (!['buy', 'sell'].includes(reqBody.buyorsell)) {
        errors.buyorsell = "INVALID SIDE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({'statusCode':400, "errors": errors })
    }

    return next();
}