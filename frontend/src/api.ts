export const API_BASE_URL = 'https://api-service.calmmoss-0396cbc1.germanywestcentral.azurecontainerapps.io/api';

export interface CarFeatures {
    make: string;
    fuelType: string;
    aspiration: string;
    numOfDoors: string;
    bodyStyle: string;
    driveWheels: string;
    engineLocation: string;
    wheelBase: number;
    length: number;
    width: number;
    height: number;
    curbWeight: number;
    engineType: string;
    numOfCylinders: string;
    engineSize: number;
    fuelSystem: string;
    bore: number;
    stroke: number;
    compressionRatio: number;
    horsepower: number;
    peakRpm: number;
    cityMpg: number;
    highwayMpg: number;
}

// Maps user-friendly inputs to the 57 one-hot variables
export const mapToDto = (features: CarFeatures) => {
    return {
        WheelBase: features.wheelBase,
        Length: features.length,
        Width: features.width,
        CurbWeight: features.curbWeight,
        EngineSize: features.engineSize,
        Bore: features.bore,
        Stroke: features.stroke,
        Horsepower: features.horsepower,
        PeakRpm: features.peakRpm,
        CityMpg: features.cityMpg,
        HighwayMpg: features.highwayMpg,
        
        Gas: features.fuelType === 'gas' ? 1 : 0,
        Diesel: features.fuelType === 'diesel' ? 1 : 0,
        
        FourWd: features.driveWheels === '4wd' ? 1 : 0,
        Fwd: features.driveWheels === 'fwd' ? 1 : 0,
        Rwd: features.driveWheels === 'rwd' ? 1 : 0,
        
        AlfaRomero: features.make === 'alfa-romero' ? 1 : 0,
        Audi: features.make === 'audi' ? 1 : 0,
        Bmw: features.make === 'bmw' ? 1 : 0,
        Chevrolet: features.make === 'chevrolet' ? 1 : 0,
        Dodge: features.make === 'dodge' ? 1 : 0,
        Honda: features.make === 'honda' ? 1 : 0,
        Isuzu: features.make === 'isuzu' ? 1 : 0,
        Jaguar: features.make === 'jaguar' ? 1 : 0,
        Mazda: features.make === 'mazda' ? 1 : 0,
        MercedesBenz: features.make === 'mercedes-benz' ? 1 : 0,
        Mercury: features.make === 'mercury' ? 1 : 0,
        Mitsubishi: features.make === 'mitsubishi' ? 1 : 0,
        Nissan: features.make === 'nissan' ? 1 : 0,
        Peugot: features.make === 'peugot' ? 1 : 0,
        Plymouth: features.make === 'plymouth' ? 1 : 0,
        Porsche: features.make === 'porsche' ? 1 : 0,
        Renault: features.make === 'renault' ? 1 : 0,
        Saab: features.make === 'saab' ? 1 : 0,
        Subaru: features.make === 'subaru' ? 1 : 0,
        Toyota: features.make === 'toyota' ? 1 : 0,
        Volkswagen: features.make === 'volkswagen' ? 1 : 0,
        Volvo: features.make === 'volvo' ? 1 : 0,
        
        NormalizedLosses: 122, // Default average to simplify
        Symboling: 1, // Default average to simplify
        
        Dohc: features.engineType === 'dohc' ? 1 : 0,
        L: features.engineType === 'l' ? 1 : 0,
        Ohc: features.engineType === 'ohc' ? 1 : 0,
        Ohcf: features.engineType === 'ohcf' ? 1 : 0,
        Ohcv: features.engineType === 'ohcv' ? 1 : 0,
        Rotor: features.engineType === 'rotor' ? 1 : 0,
        
        Eight: features.numOfCylinders === 'eight' ? 1 : 0,
        Five: features.numOfCylinders === 'five' ? 1 : 0,
        Four: features.numOfCylinders === 'four' ? 1 : 0,
        Six: features.numOfCylinders === 'six' ? 1 : 0,
        Three: features.numOfCylinders === 'three' ? 1 : 0,
        Twelve: features.numOfCylinders === 'twelve' ? 1 : 0,
        Two: features.numOfCylinders === 'two' ? 1 : 0,
    };
};

export const getHandshakeToken = async (): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/handshake`);
        if (!response.ok) throw new Error('Handshake failed');
        const data = await response.json();
        return data.tempToken;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const predictPrice = async (token: string, features: CarFeatures): Promise<number> => {
    try {
        const dto = mapToDto(features);
        const response = await fetch(`${API_BASE_URL}/Prediction/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-ApiKey': token
            },
            body: JSON.stringify(dto)
        });
        
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Prediction failed: ${err}`);
        }
        
        const data = await response.json();
        return data.predictedPrice;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
