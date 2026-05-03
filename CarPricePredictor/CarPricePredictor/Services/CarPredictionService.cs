using CarPricePredictor.Grpc;
using Grpc.Net.Client;
using Polly;
namespace CarPricePredictor.Services
{
    public class CarPredictionService
    {
        private readonly CarPriceService.CarPriceServiceClient _client;
        private readonly IAsyncPolicy _policy;
        public CarPredictionService(IConfiguration config, IAsyncPolicy policy)
        {
            var channel = GrpcChannel.ForAddress(config["GrpcSettings:PythonServiceUrl"]);
            _client = new CarPriceService.CarPriceServiceClient(channel);
            _policy = policy;
        }

        public async Task<double> GetPricePredictionAsync(CarFeaturesRequest request)
        {
            return await _policy.ExecuteAsync(async () =>
            {
                var response = await _client.PredictPriceAsync(request);
                return response.PredictedPrice;
            });

        }
    }
}
