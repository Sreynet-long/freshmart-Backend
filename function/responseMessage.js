

export const ResponseMessageCustomizse = (isSuccess, messageKh, messageEn)=>{
    if(messageEn === "Not Authorized"){
        return {
            isSuccess,
            messageKh: "សញ្ញាសម្ងាត់មិនត្រឹមត្រូវ",
            messageEn
        }
    }else{
        return {
            isSuccess,
            messageKh,
            messageEn
        }
    }

}

export const ResponseMessage = (isSuccess)=>{
    return {
        isSuccess,
        messageKh: isSuccess ? "ជោគជ័យ" : "បរាជ័យ",
        messageEn: isSuccess ? "Success!" : "Failed!"
    }
}

export const ResponseMessageWithData = (isSuccess, data)=>{
    return {
        isSuccess,
        messageKh: isSuccess ? "ជោគជ័យ" : "បរាជ័យ",
        messageEn: isSuccess ? "Success!" : "Failed!",
        data
    }
}