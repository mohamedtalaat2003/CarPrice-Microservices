import { type CarFeatures } from './types/car';
export type { CarFeatures };

const API_BASE = "https://api-service.calmmoss-0396cbc1.germanywestcentral.azurecontainerapps.io/api";

export const getHandshakeToken = async (): Promise<string> => {
  const res = await fetch(`${API_BASE}/Auth/handshake`);
  if (!res.ok) throw new Error("Handshake failed");
  const data = await res.json();
  return data.tempToken;
};

export const predictPrice = async (token: string, features: CarFeatures): Promise<number> => {
  // Map simple state to 57-field DTO
  const dto: any = {
    wheelBase: features.wheelBase,
    length: features.length,
    width: features.width,
    curbWeight: features.curbWeight,
    engineSize: features.engineSize,
    bore: features.bore,
    stroke: features.stroke,
    horsepower: features.horsepower,
    peakRpm: features.peakRpm,
    cityMpg: features.cityMpg,
    highwayMpg: features.highwayMpg,
    normalizedLosses: features.normalizedLosses,
    symboling: features.symboling,
    
    // One-hot mapping
    Gas: features.fuelType === "gas" ? 1 : 0,
    Diesel: features.fuelType === "diesel" ? 1 : 0,

    FourWd: features.driveWheels === "4wd" ? 1 : 0,
    Fwd: features.driveWheels === "fwd" ? 1 : 0,
    Rwd: features.driveWheels === "rwd" ? 1 : 0,
  };

  // Map Makes — split on hyphens and capitalize each word for correct PascalCase
  const makes = ["alfa-romero", "audi", "bmw", "chevrolet", "dodge", "honda", "isuzu", "jaguar", "mazda", "mercedes-benz", "mercury", "mitsubishi", "nissan", "peugot", "plymouth", "porsche", "renault", "saab", "subaru", "toyota", "volkswagen", "volvo"];
  makes.forEach(m => {
    const key = m.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    dto[key] = features.make === m ? 1 : 0;
  });

  // Map Engine Types
  const eTypes = ["dohc", "l", "ohc", "ohcf", "ohcv", "rotor"];
  eTypes.forEach(t => {
    const key = t.charAt(0).toUpperCase() + t.slice(1);
    dto[key] = features.engineType === t ? 1 : 0;
  });

  // Map Cylinders
  const cylinders = ["eight", "five", "four", "six", "three", "twelve", "two"];
  cylinders.forEach(c => {
    const key = c.charAt(0).toUpperCase() + c.slice(1);
    dto[key] = features.numOfCylinders === c ? 1 : 0;
  });

  const res = await fetch(`${API_BASE}/Prediction/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-ApiKey": token,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Prediction failed");
  }
  const data = await res.json();
  return data.predictedPrice ?? data.PredictedPrice;
};
