import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/VendorTrainer.json";
import Alert from 'react-bootstrap/Alert';
import fs from 'fs';
import axios from 'axios'
//require('dotenv').config();
function App() {

  const VendorAddress = '0x97cF1f16C954010a5A1920c4C082D5ab83ea7C77'
  const OwnerOfVendor = '0xdb634749715fB7b5B9aD6dF27A2060FE3fF7bd3e'
  // const vendorJSON = JSON.parse((fs.readFileSync('./client/accounts.json')).toString());

  //let propID;
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isOwner, setOwner] = useState(false);
  const [vendorRegister, setVendorRegister] = useState(false);
  const [tarinerRegister, setTarinerRegister] = useState(false);
  const [inputVendorValue, setInputVendorValue] = useState({ vendName: "", vendEmail: "", vendPhone: "" });
  const [inputTrainerValue, setInputTrainerValue] = useState({ TrnName: "", TrnEmail: "", TrnPhone: "", TrnTech: "" ,TrnUrl:""});
const [errormsgTrn,setErrormsgTrn]=useState(null);
const [errormsgVnd,setErrormsgVnd]=useState(null)
  const [customerAddress, setCustomerAddress] = useState('');
  const [error, setError] = useState(null);

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);

      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
     
    }
  }
  const checkVendorExists = async () => {

    try {
      if (window.ethereum&&customerAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const vendorContract = new ethers.Contract(VendorAddress, contractABI, signer);
        console.log("customer Address", customerAddress)
        const vendorExists = await vendorContract.vendorExists(customerAddress);
        console.log(vendorExists)
        if (vendorExists) {
          setVendorRegister(true)
        }

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet ");
      }
    } catch (error) {
      
    }
  }
  const checkTrainerExists = async () => {

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const vendorContract = new ethers.Contract(VendorAddress, contractABI, signer);

        const trainerExists = await vendorContract.checkTrainerExists(inputTrainerValue.TrnEmail, inputTrainerValue.TrnTech, inputTrainerValue.TrnPhone);
        if (trainerExists) {
          setTarinerRegister(true)
        }

        window.location.reload();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Vendor Already Registerd ");
      }
    } catch (error) {
      
    }
  }







  const getVendorOwnerHandler = async () => {
    try {

      if (window.ethereum) {
        if (OwnerOfVendor.toLowerCase() === customerAddress.toLowerCase()) {
          setOwner(true)

        }
        else {
          setOwner(false)
        }
      }
      else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    }
    catch (error) {
      
    }

  }

  const registerVendor = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const vendorContract = new ethers.Contract(VendorAddress, contractABI, signer);
        console.log(vendorContract);

        const txn = await vendorContract.registerVendor(ethers.utils.hashMessage((inputVendorValue.vendName)), ethers.utils.hashMessage(inputVendorValue.vendEmail), ethers.utils.hashMessage(inputVendorValue.vendPhone));
        console.log("Registering New Vendor...");
        await txn.wait();
        console.log("New Vendor Registered ", txn.hash);
        //  await getBankName();
        const vendorObj = {
          "Name": inputVendorValue.vendName,
          "Email": inputVendorValue.vendEmail,
          "Mobile": inputVendorValue.vendPhone,
          "Address": customerAddress


        }


        //  emailjs.init('Abp-GUV--L0OBZACO');
       await fetch("https://sheet.best/api/sheets/dd5dbd48-b598-4a09-aa13-56f561c968f5", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vendorObj)
        })
          .then((r) => r.json())
          .then((data) => {
            // The response comes here
            console.log(data);
          })
          .catch((error) => {
            // Errors are reported there
            console.log(error);
          });
          window.location.reload();
      
      
    } 
    else {
       setError("Metamsk Not Installed")
      
    }
  }
  catch (error) {
     
     setErrormsgVnd(error.message);
  }
  // New Trainer
  }

  const registerTrainer = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const goverContract = new ethers.Contract(VendorAddress, contractABI, signer);
        const txn = await goverContract.registerTrainer(ethers.utils.hashMessage(inputTrainerValue.TrnName), ethers.utils.hashMessage(inputTrainerValue.TrnEmail), ethers.utils.hashMessage(inputTrainerValue.TrnPhone), inputTrainerValue.TrnTech, ethers.utils.hashMessage(inputTrainerValue.TrnUrl));
        console.log("Registering New Trainer...");
        await txn.wait();
        console.log("New Trainer Registered ", txn.hash);
        //  await getBankName();

        const trainerObj = {
          "Name": inputTrainerValue.TrnName,
          "Email": inputTrainerValue.TrnEmail,
          "Mobile": inputTrainerValue.TrnPhone,
          "TrainerTech": inputTrainerValue.TrnTech,
          "LinkedInUrl": inputTrainerValue.TrnUrl,
          "RefferedBy": customerAddress


        }


        //  emailjs.init('Abp-GUV--L0OBZACO');
      await  fetch("https://sheet.best/api/sheets/b6678807-b689-4a1a-922a-72a1024413d5", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainerObj)
        })
          .then((r) => r.json())
          .then((data) => {
            // The response comes here
            console.log(data);
          })
          .catch((error) => {
          console.log("Error",error)
          
          });


        window.location.reload();
      } else {
        console.log("Ethereum object not found, install Metamask.");
       
        setError("Please install a MetaMask wallet ");
      }
    } catch (error) {
      console.log(error);
      setErrormsgTrn(error.message);
    }
  }



















  const handleInputChange = (event) => {
    setInputVendorValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }
  const handleInputChangeTrn = (event) => {
    setInputTrainerValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }


  useEffect(() => {
    checkIfWalletIsConnected();
    getVendorOwnerHandler();


    // getProposal();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
    checkVendorExists()
    //customerBalanceHandler()
  },)

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">BLAP: Blockchain Driven  Lead Acquisition Platform</span> </h2>
<section>
  <div className='headline-gradient'>
<p>
LAP is a platform for lead aquisition workers which enables them qualify leads.
</p>
</div>
</section>


      <section className="customer-section px-10 pt-5 pb-10">
       
        <div className="mt-5">
          <div className="mt-5">
            {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{customerAddress}</p>}
            <button className="btn-connect" onClick={checkIfWalletIsConnected}>
              {isWalletConnected ? "Logged In 🔒" : "Login Via Metamask 🔑"}
            </button>
          </div>
          {errormsgVnd && <p className="text-2xl text-red-700">{errormsgVnd}</p>}
        </div>
      </section>


      <section className="Vendor-section">
   
        <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Register Vendor </h2>
        <div className="p-10">
         
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="vendName"
              placeholder="Enter Your Name"
              value={inputVendorValue.vendName}
            />
            <input
              type="email"
              className="input-style"
              onChange={handleInputChange}
              name="vendEmail"
              placeholder="Enter Your Email"
              value={inputVendorValue.vendEmail}
            />

            <input
              type="number"
              className="input-style"
              onChange={handleInputChange}
              name="vendPhone"
              placeholder="EnterYour Mobile Number "
              value={inputVendorValue.vendPhone}
            />
           {!vendorRegister&&(<button
              className="btn-connect"
              onClick={registerVendor}>
              Register
            </button>)
}
          </form>

        </div>
      </section>
      
      {vendorRegister && (<section>
        <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Submit Trainer Details </h2>
        <div className="p-10">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChangeTrn}
              name="TrnName"
              placeholder="Enter Trainer  Name"
              value={inputTrainerValue.TrnName}
            />
            <input
              type="email"
              className="input-style"
              onChange={handleInputChangeTrn}
              name="TrnEmail"
              placeholder="Enter Your Email"
              value={inputTrainerValue.TrnEmail}
            />

            <input
              type="number"
              className="input-style"
              onChange={handleInputChangeTrn}
              name="TrnPhone"
              placeholder="EnterYour Mobile Number "
              value={inputTrainerValue.TrnPhone}
            />
            <input
              type="text"
              className="input-style"
              onChange={handleInputChangeTrn}
              name="TrnTech"
              placeholder="Enter Trainer Tech Domain "
              value={inputTrainerValue.TrnTech}
            />
            <input
              type="text"
              className="input-style"
              onChange={handleInputChangeTrn}
              name="TrnUrl"
              placeholder="Enter Trainer Tech Domain "
              value={inputTrainerValue.TrnUrl}
            />
            {!tarinerRegister && (<button
              className="btn-connect"
              onClick={registerTrainer}>
              Submit Trainer Details
            </button>)
            }
          </form>
          {errormsgTrn && <p className="text-2xl text-red-700">{errormsgTrn}</p>}
        </div>
      </section>
      )}

    </main>
  );
}
export default App;
