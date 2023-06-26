import React from 'react';

export const HomeCard = ({ home }) => {
  const { name, address, description, image, attributes } = home;
  const [purchasePrice, typeOfResidence, bedRooms, bathRooms, squareFeet, yearBuild] = attributes;

  return (
    <div className="card">
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
};
