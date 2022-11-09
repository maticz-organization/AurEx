// import package
import axios from 'axios';
import { validate } from 'bitcoin-address-validation';

// import modal
import {
    Currency,
    Wallet,
    Transaction,
    User
} from '../../models'

// import config
import config from '../../config';
import { dogeDepositTask } from '../../config/cron'

// import controller
import { mailTemplateLang } from '../emailTemplate.controller';

// import lib
import isEmpty from '../../lib/isEmpty';

/** 
 * BODY : userId
*/
export const createAddress = async (data) => {
    try {
        console.log("----data", data)
        let respData = await axios({
            'method': 'post',
            'url': `${config.COIN_GATE_WAY.DOGE.URL}/newAdress`,
            data
        });

        if (respData && respData.status == 200 && respData.data.status == 'SUCCESS') {
            const { result } = respData.data;
            return {
                address: result.address,
                privateKey: ''
            }
        } else {
            return {
                address: '',
                privateKey: ''
            }
        }
    }
    catch (err) {
        console.log("----err", err)
        return {
            address: '',
            privateKey: ''
        }
    }
}

dogeDepositTask.start();
export const deposit = async () => {
    dogeDepositTask.stop()
    console.log("BTC Deposit Cron");
    try {
        let currencyData = await Currency.findOne({ 'coin': "DOGE" });
        if (!currencyData) {
            return false;
        }

        let data = {};
        // data["skip"] = currencyData.block;
        console.log("---data", data)
        let respData = await axios({
            'method': "get",
            'url': `${config.COIN_GATE_WAY.DOGE.URL}/transactionList`,
            'params': data,
        });

        if (respData && respData.status == 200 && respData.data.status == 'SUCCESS') {
            const { result } = respData.data;


            if (result && result.list.length > 0) {
                for (let item of result.list) {
                    if (item.category && item.category == 'receive') {

                        if (!isEmpty(item.account)) {
                            let checkTransaction = await Transaction.findOne({ 'txid': item.txid, 'paymentType': "coin_deposit" });
                            if (!checkTransaction) {
                                let usrWallet = await Wallet.findOne({ "userId": item.account })

                                if (usrWallet) {

                                    let usrAsset = usrWallet.assets.id(currencyData._id)
                                    if (usrAsset) {
                                        let transactions = new Transaction();
                                        transactions["userId"] = usrWallet.userId;
                                        transactions["currencyId"] = usrAsset._id;
                                        transactions["coin"] = usrAsset.coin;
                                        transactions["toaddress"] = item.address;
                                        transactions["amount"] = item.amount;
                                        transactions["txid"] = item.txid;
                                        transactions["status"] = "completed";
                                        transactions["paymentType"] = "coin_deposit";

                                        let newTransactions = await transactions.save();
                                        console.log("----newTransactions", newTransactions)
                                        usrAsset.spotBal = usrAsset.spotBal + item.amount;
                                        await usrWallet.save();

                                        let usrData = await User.findOne({ "userId": usrWallet.userId })
                                        if (usrData) {
                                            let content = {
                                                'email': usrData.email,
                                                'date': new Date(),
                                                'amount': parseFloat(item.amount).toFixed(8),
                                                'transactionId': item.txid,
                                                'currency': item.coin,
                                            };

                                            mailTemplateLang({
                                                'userId': usrData._id,
                                                'identifier': 'User_deposit',
                                                'toEmail': usrData.email,
                                                content
                                            })

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                currencyData.block = currencyData.block + result.list.length;
                await currencyData.save();
            }
        }
        dogeDepositTask.start();
    } catch (err) {
        console.log("\x1b[33m%s\x1b[0m", "Erron on BTC Deposit ", err.toString());
        dogeDepositTask.start();
    }
};

/** 
 * Transfer amount
 * BODY : amount, toAddress
*/

export const transfer = async ({ userAddress, amount }) => {
    try {
        let data = {};
        data['amount'] = amount;
        data['toAddress'] = userAddress;

        let respData = await axios({
            'method': 'get',
            'url': `${config.COIN_GATE_WAY.DOGE.URL}/transfer`,
            data
        });
        if (respData && respData.status == 200 && respData.data.status == 'SUCCESS') {
            const { result } = respData.data
            console.log("----result", result)
            return {
                status: true,
                trxId: result.trxId
            }
        } else {
            console.log("----err")
            return {
                status: false,
                message: "Error occur"
            }
        }
    }
    catch (err) {
        console.log("----err", err)
        return {
            status: false,
            message: 'Error occur'
        }
    }
}

export const isAddress = (address) => {
    try {
        if (isEmpty(address)) {
            return false
        }

        return validate(address)

    } catch (err) {
        return false
    }
}