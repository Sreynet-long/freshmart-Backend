
export const ResponseMessageCustomizse = (isSuccess, messageKh, messageEn,product= null)=>{
    if(messageEn === "Not Authorized"){
        return {
            isSuccess,
            messageKh: "សញ្ញាសម្ងាត់មិនត្រឹមត្រូវ",
            messageEn,
            product: null,
        }
    }else{
        return {
            isSuccess,
            messageKh,
            messageEn,
            product,
        }
    }

}

export const ResponseMessage = (isSuccess)=>{
    return {
        isSuccess,
        messageKh: isSuccess ? "ជោគជ័យ" : "បរាជ័យ",
        messageEn: isSuccess ? "Success!" : "Failed!",
        product: null
    }
}
// Message with attached product data
export const ResponseMessageWithProduct = (isSuccess, product) => {
  return {
    isSuccess,
    messageKh: isSuccess ? "ជោគជ័យ" : "បរាជ័យ",
    messageEn: isSuccess ? "Success!" : "Failed!",
    product, // ✅ matches SDL
  };
};

export const ResponseMessageWithData = (isSuccess, data)=>{
    return {
        isSuccess,
        messageKh: isSuccess ? "ជោគជ័យ" : "បរាជ័យ",
        messageEn: isSuccess ? "Success!" : "Failed!",
        data
    }
}