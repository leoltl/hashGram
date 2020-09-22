function makeEmailVerificationService(
  publishToMessageQueue, genEmailVerificationCode, saveCode, getCode 
) {
  const NAMESPACE = 'verifcode';
  async function sendVerificationCode(email, handle) {
    // send job to queue for sending email verification email
    const verificationCode = genEmailVerificationCode();
    const emailConfig = {
      to: email,
      user: handle,
      verificationCode,
    };
    await publishToMessageQueue('job', emailConfig);
    // save verification code to redis 
    saveCode(`${NAMESPACE}:${handle}`, verificationCode)
  }

  function verify(handle, code) {
    return new Promise((resolve, reject) => {
      getCode(`${NAMESPACE}:${handle}`, (error, savedCode) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(code === savedCode);
      });
    });
  }
  
  return {
    sendVerificationCode,
    verify
  }
}

export default makeEmailVerificationService;
