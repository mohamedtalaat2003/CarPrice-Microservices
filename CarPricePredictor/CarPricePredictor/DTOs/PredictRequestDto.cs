namespace CarPricePredictor.DTOs
{
    public class PredictRequestDto
    {
        public float WheelBase { get; set; }
        public float Length { get; set; }
        public float Width { get; set; }
        public float CurbWeight { get; set; }

        // Engine & performance
        public int EngineSize { get; set; }
        public float Bore { get; set; }
        public float Stroke { get; set; }
        public float Horsepower { get; set; }
        public float PeakRpm { get; set; }

        // Fuel consumption
        public int CityMpg { get; set; }
        public int HighwayMpg { get; set; }

        // Fuel type
        public int Gas { get; set; }
        public int Diesel { get; set; }

        // Drive type
        public int FourWd { get; set; }
        public int Fwd { get; set; }
        public int Rwd { get; set; }

        // Brands (one-hot)
        public int AlfaRomero { get; set; }
        public int Audi { get; set; }
        public int Bmw { get; set; }
        public int Chevrolet { get; set; }
        public int Dodge { get; set; }
        public int Honda { get; set; }
        public int Isuzu { get; set; }
        public int Jaguar { get; set; }
        public int Mazda { get; set; }
        public int MercedesBenz { get; set; }
        public int Mercury { get; set; }
        public int Mitsubishi { get; set; }
        public int Nissan { get; set; }
        public int Peugot { get; set; }
        public int Plymouth { get; set; }
        public int Porsche { get; set; }
        public int Renault { get; set; }
        public int Saab { get; set; }
        public int Subaru { get; set; }
        public int Toyota { get; set; }
        public int Volkswagen { get; set; }
        public int Volvo { get; set; }

        // Other numeric features
        public float NormalizedLosses { get; set; }
        public int Symboling { get; set; }

        // Engine type (one-hot)
        public int Dohc { get; set; }
        public int L { get; set; }
        public int Ohc { get; set; }
        public int Ohcf { get; set; }
        public int Ohcv { get; set; }
        public int Rotor { get; set; }

        // Cylinders (one-hot)
        public int Eight { get; set; }
        public int Five { get; set; }
        public int Four { get; set; }
        public int Six { get; set; }
        public int Three { get; set; }
        public int Twelve { get; set; }
        public int Two { get; set; }
    }
}