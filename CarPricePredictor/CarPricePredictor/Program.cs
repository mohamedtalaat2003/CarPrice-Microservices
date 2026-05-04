using CarPricePredictor.Services;
using Grpc.Core;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using Polly;
using CarPricePredictor.Grpc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<CarPredictionService>();

builder.Services.AddGrpcClient<CarPriceService.CarPriceServiceClient>(options =>
{// القيمة دي بتيجي من appsettings أو Docker Environment
    var url = builder.Configuration["GrpcSettings:PythonServiceUrl"] ?? "http://localhost:50051";
    options.Address = new Uri(url);
});

var retryPolicy = Policy.Handle<Exception>().WaitAndRetryAsync(2, _ => TimeSpan.FromMilliseconds(500));
var timeOutPolicy = Policy.TimeoutAsync(TimeSpan.FromSeconds(2));
var policyWrap = Policy.WrapAsync(retryPolicy,timeOutPolicy);

builder.Services.AddSingleton<IAsyncPolicy>(policyWrap);
    
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 10; 
        opt.QueueLimit = 0; 
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins("https://car-price-microservices-aye5.vercel.app")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseMiddleware<CarPricePredictor.Middleware.ExceptionMiddleware>();
app.UseRouting();
app.UseCors("AllowAll");
app.UseRateLimiter();
app.UseMiddleware<CarPricePredictor.Middleware.ApiKeyMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
