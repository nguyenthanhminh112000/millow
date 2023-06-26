import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json';
import Escrow from './abis/Escrow.json';

// Config
import config from './config.json';

function App() {
  const [account, setAccount] = useState(null);

  const [escrow, setEscrow] = useState(null);

  const [homes, setHomes] = useState(null);

  const [provider, setProvider] = useState(null);

  const loadBlockChainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const realEstate = new ethers.Contract(
      config[network.chainId].realEstate.address,
      RealEstate,
      provider
    );
    const totalSupply = await realEstate.totalSupply();
    const homes = [];
    for (let index = 1; index <= totalSupply; index++) {
      const uri = await realEstate.tokenURI(index);
      const response = await fetch(uri);
      const metaData = await response.json();
      homes.push(metaData);
    }

    setHomes(homes);

    const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider);
    setEscrow(escrow);

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockChainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className="cards__section">
        <h3>Home For You</h3>

        <hr />

        <div className="cards">
          {homes &&
            homes.map((home) => {
              const { name, address, description, id, image, attributes } = home;
              const [purchasePrice, typeOfResidence, bedRooms, bathRooms, squareFeet, yearBuild] =
                attributes;

              return (
                <div className="card" key={id}>
                  <div className="card__image">
                    <img alt="Home" src={image} />
                  </div>

                  <div className="card__info">
                    <h4>{purchasePrice.value} ETH</h4>
                    <p>
                      <strong>{bedRooms.value}</strong> bds |<strong>{bathRooms.value}</strong> ba |
                      <strong>{squareFeet.value}</strong> sqft
                    </p>
                    <p>{address}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
