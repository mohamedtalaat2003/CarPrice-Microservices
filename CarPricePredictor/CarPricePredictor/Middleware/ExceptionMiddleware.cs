namespace CarPricePredictor.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(Exception ex) {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                // نصيحة أمنية: في مرحلة الـ Production، يفضل عدم إظهار ex.Message كاملة للمستخدم
                // عشان ميعرفش تفاصيل عن السيرفر بتاعك، ممكن تكتفي برسالة عامة.
                var response = new
                {
                    error = "An unexpected error occurred.",
                    details = "The prediction service is currently facing issues. Please try again later."
                };

                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}
