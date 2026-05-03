using CarPricePredictor.Services;

namespace CarPricePredictor.Middleware
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string TokenHeaderName = "X-ApiKey";

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context,TokenService tokenService)
        {

            if (context.Request.Path.StartsWithSegments("/api/Auth/handshake"))
            {
                await _next(context);
                return;
            }

            if (!context.Request.Headers.TryGetValue(TokenHeaderName, out var extractedToken))
            {
                
                    context.Response.StatusCode = 401; // Unauthorized
                    await context.Response.WriteAsync("API Key was not provided.");
                    return;
                }

                var appSetting = context.RequestServices.GetRequiredService<IConfiguration>();
                var apiKey = appSetting.GetValue<string>(TokenHeaderName);
                if (!tokenService.ValidateToken(extractedToken))
                {
                    context.Response.StatusCode = 401; // Unauthorized
                    await context.Response.WriteAsync("Token Expired or Invalid. Please refresh.");
                    return;
                }
                await _next(context);
            }
    }
}