export interface CarFeatures {
    wheelBase: number;
    length: number;
    width: number;
    curbWeight: number;
    engineSize: number;
    bore: number;
    stroke: number;
    horsepower: number;
    peakRpm: number;
    cityMpg: number;
    highwayMpg: number;
    normalizedLosses: number;
    symboling: number;
    make: string;
    fuelType: string;
    driveWheels: string;
    engineType: string;
    numOfCylinders: string;
}

export interface ShowcaseCar {
    brand: string;
    year: string;
    price: string;
    img: string;
}

export interface TeamMember {
    name: string;
    role: string;
    image: string;
    linkedin: string;
    github: string;
    phone: string;
}
