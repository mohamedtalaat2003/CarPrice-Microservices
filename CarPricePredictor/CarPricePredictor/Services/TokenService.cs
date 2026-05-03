using Microsoft.Extensions.Caching.Memory;

namespace CarPricePredictor.Services
{
    public class TokenService
    {
        private IMemoryCache _memoryCache;

        public TokenService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public string GenerateToken()
        {
            var token = Guid.NewGuid().ToString();
            _memoryCache.Set(token, true,TimeSpan.FromHours(1)); // Token valid for 1 hour
            return token;
        }

        public bool ValidateToken(string token)
        {
            return _memoryCache.TryGetValue(token, out _);
        }
    }
}
