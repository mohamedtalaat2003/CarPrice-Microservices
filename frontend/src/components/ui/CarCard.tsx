import React from 'react';
import { type ShowcaseCar } from '../../types/car';

const CarCard: React.FC<{ car: ShowcaseCar }> = ({ car }) => {
    return (
        <div className="car-card">
            <img src={car.img} alt={car.brand} loading="lazy" />
            <div className="car-card-header">
                <h4 className="car-brand">{car.brand}</h4>
                <span className="car-year">{car.year}</span>
            </div>
            <div className="car-price">{car.price}</div>
        </div>
    );
};

export default CarCard;
