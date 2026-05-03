using CarPricePredictor.DTOs;
using FluentValidation;
namespace CarPricePredictor.Validators
{
    public class PredictRequestDtoValidator : AbstractValidator<DTOs.PredictRequestDto>
    {
        public PredictRequestDtoValidator()
        {
            // =====================
            // Basic Dimensions
            // =====================
            RuleFor(x => x.WheelBase)
                .InclusiveBetween(80, 150)
                .WithMessage("WheelBase must be between 80 and 150");

            RuleFor(x => x.Length)
                .InclusiveBetween(140, 220);

            RuleFor(x => x.Width)
                .InclusiveBetween(60, 80);

            RuleFor(x => x.CurbWeight)
                .InclusiveBetween(1000, 5000);

            // =====================
            // Engine
            // =====================
            RuleFor(x => x.EngineSize)
                .InclusiveBetween(50, 400);

            RuleFor(x => x.Bore)
                .InclusiveBetween(2.0f, 5.0f);

            RuleFor(x => x.Stroke)
                .InclusiveBetween(2.0f, 5.0f);

            RuleFor(x => x.Horsepower)
                .InclusiveBetween(0, 500);

            RuleFor(x => x.PeakRpm)
                .InclusiveBetween(3000, 7000);

            // =====================
            // Fuel consumption
            // =====================
            RuleFor(x => x.CityMpg)
                .InclusiveBetween(5, 60);

            RuleFor(x => x.HighwayMpg)
                .InclusiveBetween(5, 60);

            // =====================
            // Fuel Type (must choose one)
            // =====================
            RuleFor(x => x)
                .Must(x => x.Gas + x.Diesel == 1)
                .WithMessage("You must select either Gas or Diesel (not both or none)");

            // =====================
            // Drive Type (must choose one)
            // =====================
            RuleFor(x => x)
                .Must(x => x.FourWd + x.Fwd + x.Rwd == 1)
                .WithMessage("Select exactly one drive type");

            // =====================
            // Brand (one-hot → exactly one = 1)
            // =====================
            RuleFor(x => x)
                .Must(x =>
                    x.AlfaRomero + x.Audi + x.Bmw + x.Chevrolet +
                    x.Dodge + x.Honda + x.Isuzu + x.Jaguar +
                    x.Mazda + x.MercedesBenz + x.Mercury + x.Mitsubishi +
                    x.Nissan + x.Peugot + x.Plymouth + x.Porsche +
                    x.Renault + x.Saab + x.Subaru + x.Toyota +
                    x.Volkswagen + x.Volvo == 1
                )
                .WithMessage("Select exactly one brand");

            // =====================
            // Engine Type (one-hot)
            // =====================
            RuleFor(x => x)
                .Must(x =>
                    x.Dohc + x.L + x.Ohc + x.Ohcf + x.Ohcv + x.Rotor == 1
                )
                .WithMessage("Select exactly one engine type");

            // =====================
            // Cylinders (one-hot)
            // =====================
            RuleFor(x => x)
                .Must(x =>
                    x.Eight + x.Five + x.Four + x.Six +
                    x.Three + x.Twelve + x.Two == 1
                )
                .WithMessage("Select exactly one cylinder type");

            // =====================
            // Other features
            // =====================
            RuleFor(x => x.NormalizedLosses)
                .InclusiveBetween(0, 500);

            RuleFor(x => x.Symboling)
                .InclusiveBetween(-3, 3);
        }
    }
}
