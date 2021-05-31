import { AES, enc } from 'crypto-js';
function Test() {
  let data = { user: 'niraj', iden: '13121312635' };
  const encrypt = AES.encrypt(JSON.stringify(data), 'q1w2e3r4');
  const encryptdata = encrypt.toString();
  const decrypted = AES.decrypt(encryptdata, 'q1w2e3r4');
  const decryptedObject = decrypted.toString(enc.Utf8);
  console.log('data:', data);
  console.log('encrypt:', encrypt);
  console.log('encryptdata to string data:', encryptdata);
  console.log('decrypted:', decrypted);
  console.log('decrypted data to string:', decryptedObject);
  return <div></div>;
}
export default Test;
