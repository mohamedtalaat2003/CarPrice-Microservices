using CarPricePredictor.DTOs;
using CarPricePredictor.Grpc;
using CarPricePredictor.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CarPricePredictor.Controllers
{
    [EnableRateLimiting("fixed")]
    [Route("api/[controller]")]
    [ApiController]
    public class PredictionController : ControllerBase
    {
        private readonly CarPredictionService _predictionService;
        public PredictionController(CarPredictionService predictionService)
        {
            _predictionService = predictionService;
        }

        [HttpPost("predict")]
        public async Task<ActionResult> Predict([FromBody] PredictRequestDto dto)
        {
            var grpcRequest = new CarFeaturesRequest
            {
                WheelBase = dto.WheelBase,
                Length = dto.Length,
                Width = dto.Width,
                CurbWeight = dto.CurbWeight,
                EngineSize = dto.EngineSize,
                Bore = dto.Bore,
                Stroke = dto.Stroke,
                Horsepower = dto.Horsepower,
                PeakRpm = dto.PeakRpm,

                CityMpg = dto.CityMpg,
                HighwayMpg = dto.HighwayMpg,

                Gas = dto.Gas,
                Diesel = dto.Diesel,

                FourWd = dto.FourWd,
                Fwd = dto.Fwd,
                Rwd = dto.Rwd,

                AlfaRomero = dto.AlfaRomero,
                Audi = dto.Audi,
                Bmw = dto.Bmw,
                Chevrolet = dto.Chevrolet,
                Dodge = dto.Dodge,
                Honda = dto.Honda,
                Isuzu = dto.Isuzu,
                Jaguar = dto.Jaguar,
                Mazda = dto.Mazda,
                MercedesBenz = dto.MercedesBenz,
                Mercury = dto.Mercury,
                Mitsubishi = dto.Mitsubishi,
                Nissan = dto.Nissan,
                Peugot = dto.Peugot,
                Plymouth = dto.Plymouth,
                Porsche = dto.Porsche,
                Renault = dto.Renault,
                Saab = dto.Saab,
                Subaru = dto.Subaru,
                Toyota = dto.Toyota,
                Volkswagen = dto.Volkswagen,
                Volvo = dto.Volvo,

                NormalizedLosses = dto.NormalizedLosses,
                Symboling = dto.Symboling,

                Dohc = dto.Dohc,
                L = dto.L,
                Ohc = dto.Ohc,
                Ohcf = dto.Ohcf,
                Ohcv = dto.Ohcv,
                Rotor = dto.Rotor,

                Eight = dto.Eight,
                Five = dto.Five,
                Four = dto.Four,
                Six = dto.Six,
                Three = dto.Three,
                Twelve = dto.Twelve,
                Two = dto.Two
            };

            var price = await _predictionService.GetPricePredictionAsync(grpcRequest);

            return Ok(new { PredictedPrice = price });
        }
    }
}
