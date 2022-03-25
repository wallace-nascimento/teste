import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
//import logo from '../logo.jpg';
import './App.css';
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

   const ethBalance = await web3.eth.getBalance(this.state.account)
   this.setState({ ethBalance })
   console.log(this.state.ethBalance)

   //load token
   const networksId = await web3.eth.net.getId()
   const tokenData = Token.networks[networksId]
   if(tokenData){
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState=({token: token})
      //let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      //console.log("tokenBalance", tokenBalance.toString())
      //this.setState({ tokenBalance: tokenBalance.toString() })
   } else{
     window.alert('Token contract not deployed to detected netWork.')
   }

   //load EthSwap
   const ethSwapData = EthSwap.networks[networksId]
   if(ethSwapData){
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState=({ethSwap})
   } else{
     window.alert('EthSwap contract not deployed to detected netWork.')
   }
   //this.setState({ loading: false })
    
  }

  async loadWeb3(){
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

   constructor(props) {
    super(props)
    this.state = {
      accounts: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: false
     }
    
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id="loader" className="text-center" >Loading...</p>
    }else{
      content = <Main 
      ethBalance={this.state.ethBalance} 
      //tokenBalance={this.state.tokenBalance}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}} >
              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {content }
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
