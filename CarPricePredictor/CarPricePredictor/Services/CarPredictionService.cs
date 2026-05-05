using CarPricePredictor.Grpc;
using Grpc.Net.Client;
using Polly;
namespace CarPricePredictor.Services
{
    public class CarPredictionService
    {
        private readonly CarPriceService.CarPriceServiceClient _client;
        private readonly IAsyncPolicy _policy;
        private readonly ILogger<CarPredictionService> _logger; // تعريف اللوجر
        public CarPredictionService(IConfiguration config, IAsyncPolicy policy, ILogger<CarPredictionService> logger)
        {
            var channel = GrpcChannel.ForAddress(config["GrpcSettings:PythonServiceUrl"]);
            _client = new CarPriceService.CarPriceServiceClient(channel);
            _policy = policy;
            _logger = logger;
        }

        public async Task<double> GetPricePredictionAsync(CarFeaturesRequest request)
        {
            _logger.LogInformation("Sending gRPC request to Python ML Service...");
            return await _policy.ExecuteAsync(async () =>
            {
                try
                {
                var response = await _client.PredictPriceAsync(request);
                    _logger.LogInformation("Successfully received prediction from ML Service.");
                    return response.PredictedPrice;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while calling ML Service.");
                    throw; // Rethrow to let Polly handle the retry logic
                }
            });

        }
    }
}
