// Propaganda.js



var account = null,
    keyRing = {},
    web3 = null;



window.onload = async () => {

  if(window.ethereum) {

    window.web3 = new Web3(ethereum);

    try {

      await MISC.prototypes();

      await loginWithEth();
      await prepareApps();
    } catch(error) { console.error(error); }
  }
  else await prepareApps();
}



async function loginWithEth() {

  if(window.web3) {

    try { window.account = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0]; }
    catch(error) { MISC.connectAccountError(); }
  }
  else MISC.connectAccountError();
}



async function prepareApps() {

  await fetch('/json/KeyRing.json').then(response => response.json()).then(async (keys) => {

    window.keyRing = keys;

    new AddressBook();

  }).catch(error => MISC.loadContractError());
}
